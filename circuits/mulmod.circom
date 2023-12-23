pragma circom 2.1.6;
include "div.circom";
include "mod.circom";
include "mul.circom";

template MulMod () {
  signal input in1[2], in2[2], in3[2];
  signal sum[2] <== Mul()(in1, in2);
  signal output out[2] <== Mod()(sum, in3);
}