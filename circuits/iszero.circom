pragma circom 2.1.6;
include "../node_modules/circomlib/circuits/comparators.circom";

template IsZero256 () {
  signal input in[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper

  signal is_zero_lower <== IsZero()(in[0]);
  signal is_zero_upper <== IsZero()(in[1]);

  signal output out[2] <== [
    is_zero_lower * is_zero_upper,
    0
  ];
}