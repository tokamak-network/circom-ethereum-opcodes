pragma circom 2.1.6;
include "slt.circom";

template SGT () {
  signal input in1[2], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
  signal output out[2] <== SLT()(in2, in1);
}