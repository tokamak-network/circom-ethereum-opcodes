pragma circom 2.1.6;
include "../node_modules/circomlib/circuits/gates.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

template Or () {
  // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
  signal input in[4];
  signal in1[2] <== [in[0], in[1]];
  signal in2[2] <== [in[2], in[3]];

  var NUM_BITS = 128;
  component lower_num_to_bits[2];
  component upper_num_to_bits[2];

  lower_num_to_bits[0] = Num2Bits(NUM_BITS);
  lower_num_to_bits[0].in <== in1[0];
  lower_num_to_bits[1] = Num2Bits(NUM_BITS);
  lower_num_to_bits[1].in <== in2[0];
  
  upper_num_to_bits[0] = Num2Bits(NUM_BITS); 
  upper_num_to_bits[0].in <== in1[1]; 
  upper_num_to_bits[1] = Num2Bits(NUM_BITS);  
  upper_num_to_bits[1].in <== in2[1];

  component lower_bits_to_num = Bits2Num(NUM_BITS);
  component upper_bits_to_num = Bits2Num(NUM_BITS);

  for (var i = 0; i < NUM_BITS; i++) {
    // lower
    lower_bits_to_num.in[i] <== OR()(lower_num_to_bits[0].out[i], lower_num_to_bits[1].out[i]); // OR gate

    // upper
    upper_bits_to_num.in[i] <== OR()(upper_num_to_bits[0].out[i], upper_num_to_bits[1].out[i]); // OR gate
  }

  signal output out[2] <== [
    lower_bits_to_num.out,
    upper_bits_to_num.out
  ];
}