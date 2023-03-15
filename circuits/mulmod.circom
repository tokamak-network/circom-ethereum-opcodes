pragma circom 2.0.5;
include "div.circom";
include "mod.circom";

template MulMod () {
  signal input in[3];
  signal mul;
  signal output out;

  mul <== in[0] * in[1];

  component div = Div();

  div.in[0] <== mul;
  div.in[1] <== in[2];

  component mod = Mod();
  mod.in[0] <== mul;
  mod.in[1] <== in[2];
  out <== mod.out;
}