pragma circom 2.1.6;
include "lt.circom";
include "templates/128bit/div_and_mod.circom";
include "../node_modules/circomlib/circuits/gates.circom";

// if two msb are different, then the result is the msb of the first input
// otherwise, the result is the result of lt(in1, in2)

template SLT () {
  signal input in1[2], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
  signal output out[2];

  component div_and_mod1 = DivAndMod();
  div_and_mod1.in[0] <== in1[1];
  div_and_mod1.in[1] <== 2**127;
  signal first_msb <== div_and_mod1.q;
  first_msb * (1 - first_msb) === 0;

  component div_and_mod2 = DivAndMod();
  div_and_mod2.in[0] <== in2[1];
  div_and_mod2.in[1] <== 2**127;
  signal second_msb <== div_and_mod2.q;
  second_msb * (1 - second_msb) === 0;

  signal lt_out[2] <== LT()(in1, in2);
  signal xor_out <== XOR()(first_msb, second_msb);

  out[0] <== xor_out * (first_msb - lt_out[0]) + lt_out[0];
  out[1] <== 0;
}