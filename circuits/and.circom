pragma circom 2.1.6;
include "../node_modules/circomlib/circuits/bitify.circom";

template And () {
  var NUM_BIT = 253;

  signal input in[2];
  signal output out;

  var i;
  // Input -> bit num2bits
  component num2bits[2];

  for (i = 0; i < 2; i++) {
    num2bits[i] = Num2Bits(NUM_BIT);
    num2bits[i].in <== in[i];
  }

  component bits2num = Bits2Num(NUM_BIT);
  for (var i = 0; i < NUM_BIT; i++) {
    // AND op
    bits2num.in[i] <== num2bits[0].out[i] * num2bits[1].out[i];
  }
  out <== bits2num.out;
}