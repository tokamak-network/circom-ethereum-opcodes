pragma circom 2.0.5;
include "div.circom";

template AddMod () {
  signal input in[3];
  signal sum;
  signal output out;

  sum <== in[0] + in[1];

  component div = Div();

  div.in[0] <== sum;
  div.in[1] <== in[2];

  out <-- sum % in[2];
  sum === div.out * in[2] + out;
}
// component main {public [in]} = AddMod();