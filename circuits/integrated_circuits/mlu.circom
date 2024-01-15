pragma circom 2.1.6;
include "../lt.circom";
include "../slt.circom";
include "../not.circom";
include "../shl.circom";
include "../shr.circom";
include "../sar.circom";
include "../../node_modules/circomlib/circuits/bitify.circom";
include "../../node_modules/circomlib/circuits/gates.circom";

template SwapInputs () {
  signal input in[2][2], flag; // flag is 0 or 1 to indicate if the inputs should be swapped
  signal output out[2][2] <== [
    [in[0][0] + flag * (in[1][0] - in[0][0]), in[0][1] + flag * (in[1][1] - in[0][1])],
    [in[1][0] + flag * (in[0][0] - in[1][0]), in[1][1] + flag * (in[0][1] - in[1][1])]
  ];
}

template MLU () {
  var NUM_FUNCTIONS = 8;
  signal input in[2][2], selector;
  signal inter[NUM_FUNCTIONS - 3][2];

  // selector bitification
  signal b_selector[NUM_FUNCTIONS] <== Num2Bits(NUM_FUNCTIONS)(selector);

  // operator 0x10: lt and 0x11: gt
  // use the same lt circuit for both lt and gt
  signal lt_in[2][2] <== SwapInputs()(in, b_selector[1]);
  signal lt_out[2] <== LT()(lt_in[0], lt_in[1]);
  signal lt_selector <== OR()(b_selector[0], b_selector[1]);
  inter[0] <== [
    lt_selector * lt_out[0],
    0
  ];

  // operator 0x12: slt and 0x13: sgt
  // use the same slt circuit for both slt and sgt
  signal slt_in[2][2] <== SwapInputs()(in, b_selector[3]);
  signal slt_out[2] <== SLT()(slt_in[0], slt_in[1]);
  signal slt_selector <== OR()(b_selector[2], b_selector[3]);
  inter[1] <== [
    inter[0][0] + slt_selector * slt_out[0],
    inter[0][1] + 0
  ];

  // operator 0x19 not
  signal not_out[2] <== Not()(in[0]);
  inter[2] <== [
    inter[1][0] + b_selector[4] * not_out[0],
    inter[1][1] + b_selector[4] * not_out[1]
  ];

  // operator 0x1b: shl
  signal shl_out[2] <== SHL()(in[0], in[1]);
  inter[3] <== [
    inter[2][0] + b_selector[5] * shl_out[0],
    inter[2][1] + b_selector[5] * shl_out[1]
  ];

  // operator 0x1c: shr
  signal shr_out[2] <== SHR()(in[0], in[1]);
  inter[4] <== [
    inter[3][0] + b_selector[6] * shr_out[0],
    inter[3][1] + b_selector[6] * shr_out[1]
  ];

  // operator 0x1d: sar
  signal sar_out[2] <== SAR()(in[0], in[1]);
  signal output out[2] <== [
    inter[4][0] + b_selector[7] * sar_out[0],
    inter[4][1] + b_selector[7] * sar_out[1]
  ];
}