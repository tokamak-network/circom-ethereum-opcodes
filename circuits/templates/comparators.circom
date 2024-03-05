pragma circom 2.1.6;
include "128bit/divider.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";

template IsLessThanN () {
  signal input in[2], n; // assume n < 2**128

  signal is_zero_out <== IsZero()(in[1]); // check if upper 128-bit integer is zero

  component divider = Divider128();
  divider.in <== [in[0], n];
  signal is_lower_less_than_n <== IsZero()(divider.q); // check if lower 128-bit integer is less than n

  signal output out <== is_zero_out * is_lower_less_than_n; // check if both are true
}

template IsLessThanN128 () { 
  signal input in, n;

  component divider = Divider128();
  divider.in <== [in, n];
  signal output out <== IsZero()(divider.q);
}

template IsLessThanExp (n) {
  assert(n <= 128);
  signal input in[2];

  signal is_zero_out <== IsZero()(in[1]); // check if upper 128-bit integer is zero

  component divider = Divider(n);
  divider.in <== in[0];
  signal is_lower_less_than_n <== IsZero()(divider.q); // check if lower 128-bit integer is less than n

  signal output out <== is_zero_out * is_lower_less_than_n; // check if both are true
}