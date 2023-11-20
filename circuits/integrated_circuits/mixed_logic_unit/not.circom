pragma circom 2.0.5;
include "../../../node_modules/circomlib/circuits/bitify.circom";
template NotWithoutBitification (NUM_BITS) {
  signal input in[NUM_BITS];
  signal output out;

  component bits2num = Bits2Num(NUM_BITS);
  for (var i = 0; i < NUM_BITS; i++) {
    bits2num.in[i] <== 1 - in[i]; // Not op
  }
  out <== bits2num.out;

}