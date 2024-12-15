pragma circom 2.1.6;
include "slt.circom";

template SGT () {
  // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
  signal input in[4];
  signal in1[2] <== [in[0], in[1]];
  signal in2[2] <== [in[2], in[3]];
  signal output out[2] <== SLT()([in2[0], in2[1], in1[0], in1[1]]);
}