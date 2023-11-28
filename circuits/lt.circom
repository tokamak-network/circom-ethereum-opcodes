pragma circom 2.1.6;
include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/gates.circom";

template LT () {
  signal input in1[2], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
  signal output out[2];

  signal lt_lower_out <== LessThan(128)([in1[0], in2[0]]);
  signal lt_upper_out <== LessThan(128)([in1[1], in2[1]]);
  signal eq_out <== IsEqual()([in1[1], in2[1]]);
  signal not_out <== NOT()(eq_out);

  signal inter <== not_out * lt_upper_out;
  out[0] <== eq_out * lt_lower_out + inter;
  out[1] <== 0;
}