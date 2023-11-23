pragma circom 2.1.6;
include "exp.circom";

template SHL () {
  signal input in[2];
  signal output out;

  // out == in * 2**n
  component exp = Exp();
  exp.in[0] <== 2;
  exp.in[1] <== in[0];
  out <== in[1] * exp.out;
}