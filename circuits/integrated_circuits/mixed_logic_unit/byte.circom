pragma circom 2.1.6;
include "../../shr.circom";
include "../../mod.circom";
include "../../../node_modules/circomlib/circuits/comparators.circom";

// y = (in[1] >> (248 - in[0] * 8)) & 0xFF
// in[0] >= 32 : out = 0
template ByteWithoutBitification () {
  signal input in[2], lt_out;
  signal output out;

  component shr = SHR();
  shr.in[0] <== lt_out * (248 - in[0] * 8);
  shr.in[1] <== in[1];

  component mod = Mod();
  mod.in[0] <== shr.out;
  mod.in[1] <== 256;

  out <==  mod.out * lt_out;
}