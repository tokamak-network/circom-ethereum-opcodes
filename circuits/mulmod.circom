pragma circom 2.1.6;
include "div.circom";
include "mod.circom";
include "mul.circom";

//intermediate operation is not subject to 2^256 modulo
template MulMod () {
  signal input in1[2], in2[2], in3[2];
  signal sum[4] <== BigMul256()(in1, in2);
  signal output out[2] <== BigMod()(sum, in3);
}