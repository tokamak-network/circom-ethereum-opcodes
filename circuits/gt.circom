pragma circom 2.1.6;
include "lt.circom";

template GT () {
  signal input in1[2], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
  signal output out[2];

  out <== LT()(in2, in1);
}