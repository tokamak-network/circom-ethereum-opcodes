pragma circom 2.1.6;
include "../node_modules/circomlib/circuits/bitify.circom";

template Not () {
  var NUM_BIT = 253;

  signal input in;
  signal output out;

  // Input -> bit num2bits
  component num2bits;

  num2bits = Num2Bits(NUM_BIT);
  num2bits.in <== in;

  component bits2num = Bits2Num(NUM_BIT);
  for (var i = 0; i < NUM_BIT; i++) {
    // Not op
    bits2num.in[i] <== 1 - num2bits.out[i];
  }
  out <== bits2num.out;
}