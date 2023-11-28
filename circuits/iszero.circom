pragma circom 2.1.6;
include "templates/comparators.circom";

template IsZero () {
  signal input in[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
  signal output out[2];

  signal is_zero_lower <== IsZero128()(in[0]);
  signal is_zero_upper <== IsZero128()(in[1]);

  out[0] <== is_zero_lower * is_zero_upper;
  out[1] <== 0;
}