pragma circom 2.0.5;
include "shr.circom";
include "mod.circom";

// y = (in[1] >> (248 - in[0] * 8)) & 0xFF
template Byte () {
  signal input in[2];
  signal output out;

  assert(in[0] < 32);

  component shr = SHR();
  shr.in[0] <== 248 - in[0] * 8;
  shr.in[1] <== in[1];

  component mod = Mod();
  mod.in[0] <== shr.out;
  mod.in[1] <== 256;

  out <==  mod.out;
}