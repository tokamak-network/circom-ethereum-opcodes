pragma circom 2.0.5;
include "div.circom";
include "exp.circom";

template SHR () {
  signal input in;
  signal input n;
  signal output out;

  // out == in / 2**n
  component exp = Exp();
  exp.in <== 2;
  exp.n <== n;

  component div = Div();
  div.in[0] <== in;
  div.in[1] <== exp.out;

  out <== div.out;
}