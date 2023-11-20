pragma circom 2.0.5;
include "../../../node_modules/circomlib/circuits/gates.circom";
include "../../shr.circom";

template SLTWithoutBitification (NUM_BITS) {
  signal input in[2], lt_out;
  signal output out;

  assert(in[0] >> NUM_BITS == 0);
  assert(in[1] >> NUM_BITS == 0);

  component shr[2];
  for (var i = 0; i < 2; i++){
    shr[i] = SHR();
    shr[i].in[0] <== NUM_BITS - 1;
    shr[i].in[1] <== in[i];
  }

  component xor = XOR();
  xor.a <== shr[0].out;
  xor.b <== shr[1].out;

  out <== xor.out * (shr[0].out - lt_out) + lt_out;
}