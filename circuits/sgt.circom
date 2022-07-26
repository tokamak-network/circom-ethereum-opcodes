pragma circom 2.0.5;
include "slt.circom";

template SGT () {
  signal input in[2];
  signal output out;

  component slt = SLT();
  slt.in[0] <== in[1];
  slt.in[1] <== in[0];

  out <== slt.out;
}