pragma circom 2.1.6;
include "shr.circom";
include "mod.circom";
include "templates/comparators.circom";

// y = (in[1] >> (248 - in[0] * 8)) & 0xFF
// in[0] >= 32 : out = 0
template Byte () {
  signal input in[2];
  signal output out;
  
  var NUM_BITS = 256;

  component lt = LT(NUM_BITS);
  lt.in[0] <== in[0];
  lt.in[1] <== 32;

  component shr = SHR();
  shr.in[0] <== lt.out * (248 - in[0] * 8);
  shr.in[1] <== in[1];

  component mod = Mod();
  mod.in[0] <== shr.out;
  mod.in[1] <== NUM_BITS;

  out <==  mod.out * lt.out;
}