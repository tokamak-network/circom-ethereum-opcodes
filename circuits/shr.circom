pragma circom 2.0.5;
include "div.circom";
include "exp.circom";

template SHR () {
  signal input in[2];
  signal output out;

  // out == in / 2**n
  component exp = Exp();
  exp.in[0] <== 2;
  exp.in[1] <== in[1];

  component div = Div();
  div.in[0] <== in[0];
  div.in[1] <== exp.out;

  out <== div.out;
}