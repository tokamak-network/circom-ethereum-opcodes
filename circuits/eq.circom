pragma circom 2.1.6;
include "../node_modules/circomlib/circuits/comparators.circom";

template Eq () {
  signal input in1[2], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper

  signal eq_lower_out <== IsEqual()([in1[0], in2[0]]);
  signal eq_upper_out <== IsEqual()([in1[1], in2[1]]);

  signal output out[2] <== [
    eq_lower_out * eq_upper_out,
    0
  ];
}