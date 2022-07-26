pragma circom 2.0.5;
include "exp.circom";

template SHL () {
  signal input in;
  signal input n;
  signal output out;

  // out == in * 2**n
  component exp = Exp();
  exp.in <== 2;
  exp.n <== n;
  out <== in * exp.out;
}
// component main {public [in, n]} = SHL();