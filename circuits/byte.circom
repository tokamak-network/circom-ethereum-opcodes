pragma circom 2.1.6;
include "templates/128bit/exp.circom";
include "templates/comparators.circom";
include "templates/128bit/divider.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template Byte () {
  // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
  // in1: index, in2: value
  signal input in[4];
  signal in1[2] <== [in[0], in[1]];
  signal in2[2] <== [in[2], in[3]];
  
  // check if in1 < 32 (2**5)
  // if lt_32 = 0 output should be 0.
  signal lt_32 <== IsLessThanExp(5)(in1);

  //in2 >> (248 - (in1[0]*8)) & 0xff

  //selector
  //(1) 0~128bit : in1[0] < 16(bytes), (0) 128~256bit : in1[0] >= 16(bytes)
  component divider_index = Divider(4);
  divider_index.in <== in1[0];
  signal selector <== IsZero()(divider_index.q);

  signal divisor_exp <== 120 - (divider_index.r*8);
  //var divisor_exp = 120 - (divider_index.r*8);

  signal shr_exp <== BinaryExp128()(divisor_exp * lt_32);

  // inter[0] <-- selector * (in2[0] / divisor);
  // inter[1] <-- (1 - selector) * (in2[1] / divisor);
  // in2[0] === inter[0] * divisor
  component select_cell[2];
  for (var i = 0; i < 2; i++) { select_cell[i] = Divider128(); }

  select_cell[0].in <== [in2[1], shr_exp];
  select_cell[1].in <== [in2[0], shr_exp];

  signal inter[2];
  inter[0] <== selector * select_cell[0].q;
  inter[1] <== inter[0] + (1 - selector) * select_cell[1].q;

  //inter[1] & 0xff
  component num_bytes = Divider(8);
  num_bytes.in <== inter[1];

  signal output out[2] <== [
    num_bytes.r * lt_32,
    0
  ];
}