pragma circom 2.1.6;
include "../node_modules/circomlib/circuits/bitify.circom";

template And () {
  var NUM_BITS = 256;

  signal input in[2];
  signal output out;

  var i;
  // Input -> bit num2bits
  component num2bits[2];

  for (i = 0; i < 2; i++) {
    num2bits[i] = Num2Bits(NUM_BITS);
    num2bits[i].in <== in[i];
  }

  component bits2num = Bits2Num(NUM_BITS);
  for (var i = 0; i < NUM_BITS; i++) {
    // AND op
    bits2num.in[i] <== num2bits[0].out[i] * num2bits[1].out[i];
  }
  out <== bits2num.out;
}