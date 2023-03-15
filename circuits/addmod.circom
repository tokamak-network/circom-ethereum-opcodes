pragma circom 2.0.5;
include "div.circom";
include "mod.circom";

template AddMod () {
  signal input in[3];
  signal sum;
  signal output out;

  sum <== in[0] + in[1];

  component div = Div();
  div.in[0] <== sum;
  div.in[1] <== in[2];

  component mod = Mod();
  mod.in[0] <== sum;
  mod.in[1] <== in[2];
  
  out <== mod.out;
}