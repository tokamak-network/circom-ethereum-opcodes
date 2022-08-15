pragma circom 2.0.5;
include "exp.circom";

template SHL () {
  signal input in[2];
  signal output out;

  // out == in * 2**n
  component exp = Exp();
  exp.in[0] <== 2;
  exp.in[1] <== in[1];
  out <== in[0] * exp.out;
}