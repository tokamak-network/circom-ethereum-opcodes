pragma circom 2.0.5;
include "div.circom";

// TODO: 0 if in[2] == 0
template MulMod () {
  signal input in[3];
  signal mul;
  signal output out;

  mul <== in[0] * in[1];

  component div = Div();

  div.in[0] <== mul;
  div.in[1] <== in[2];

  out <-- mul % in[2];
  mul === div.out * in[2] + out;
}