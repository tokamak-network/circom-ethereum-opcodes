pragma circom 2.1.6;
include "128bit/div_and_mod.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";

template IsLessThanN () {
  signal input in[2], n; // assume n < 2**128

  signal is_zero_out <== IsZero()(in[1]); // check if upper 128-bit integer is zero

  component div_and_mod = DivAndMod();
  div_and_mod.in <== [in[0], n];
  signal iis_lower_less_than_n <== IsZero()(div_and_mod.q); // check if lower 128-bit integer is less than 32

  signal output out <== is_zero_out * iis_lower_less_than_n; // check if both are true
}