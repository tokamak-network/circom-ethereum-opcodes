pragma circom 2.1.6;
include "lt.circom";
include "templates/128bit/divider.circom";
include "../node_modules/circomlib/circuits/gates.circom";

// if two msb are different, then the result is the msb of the first input
// otherwise, the result is the result of lt(in1, in2)

template SLT () {
  // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
  signal input in[4];
  signal in1[2] <== [in[0], in[1]];
  signal in2[2] <== [in[2], in[3]];

  component divider1 = Divider(127);
  divider1.in <== in1[1];
  signal first_msb <== divider1.q;
  first_msb * (1 - first_msb) === 0;

  component divider2 = Divider(127);
  divider2.in <== in2[1];
  signal second_msb <== divider2.q;
  second_msb * (1 - second_msb) === 0;

  signal lt_out[2] <== LT()([in1[0], in1[1], in2[0], in2[1]]);
  signal xor_out <== XOR()(first_msb, second_msb);

  signal output out[2] <== [
    xor_out * (first_msb - lt_out[0]) + lt_out[0],
    0
  ];
}