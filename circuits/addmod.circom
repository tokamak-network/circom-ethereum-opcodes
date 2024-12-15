pragma circom 2.1.6;
include "add.circom";
include "div.circom";
include "mod.circom";

//intermediate operation is not subject to 2^256 modulo
template AddMod () {
  signal input in[6];
  signal in1[2] <== [in[0], in[1]];
  signal in2[2] <== [in[2], in[3]];
  signal in3[2] <== [in[4], in[5]];
  signal sum[2] <== BigAdd()(in1, in2);
  signal output out[2] <== CarryMod()(sum, in3);
}