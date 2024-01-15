pragma circom 2.1.6;
include "128bit/divider.circom";

template Mod256 () {
  signal input in1[2], in2; // in1: dividend, in2: divisor

  component divider[3];
  divider[0] = Divider128();
  divider[1] = Divider128();
  divider[2] = Divider128();

  divider[0].in <== [in1[0], in2];
  divider[1].in <== [2**128, in2];
  divider[2].in <== [in1[1], in2];

  signal remainder <== divider[0].r + divider[1].r * divider[2].r;

  component splitter = Divider128();
  splitter.in <== [remainder, 2**128];
  signal output out[2] <== [
    splitter.r,
    splitter.q
  ];
}