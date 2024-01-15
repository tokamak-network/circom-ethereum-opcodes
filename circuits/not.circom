pragma circom 2.1.6;
include "../node_modules/circomlib/circuits/gates.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

template Not () {
  signal input in[2];

  var NUM_BIT = 128;

  component num_to_bits[2];
  num_to_bits[0] = Num2Bits(NUM_BIT);
  num_to_bits[1] = Num2Bits(NUM_BIT);
  num_to_bits[0].in <== in[0];
  num_to_bits[1].in <== in[1];

  component bits_to_num[2];
  bits_to_num[0] = Bits2Num(NUM_BIT);
  bits_to_num[1] = Bits2Num(NUM_BIT);

  for (var i = 0; i < NUM_BIT; i++) {
    bits_to_num[0].in[i] <== NOT()(num_to_bits[0].out[i]); // NOT gate
    bits_to_num[1].in[i] <== NOT()(num_to_bits[1].out[i]); // NOT gate
  }

  signal output out[2] <== [
    bits_to_num[0].out,
    bits_to_num[1].out
  ];
}