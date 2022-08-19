pragma circom 2.0.5;
include "mod.circom";
include "../node_modules/circomlib/circuits/bitify.circom";
include "../node_modules/circomlib/circuits/gates.circom";

// TODO: 0 if in[1] == 0
template Smod () {
  signal input in[2];
  signal output out;

  assert(in[1] != 0);

  var NUM_BIT = 253;
  var MAX_VALUE = 14474011154664524427946373126085988481658748083205070504932198000989141204992; // 2**253
  component num2Bits[2];
  component mod = Mod();
  for (var i = 0; i < 2; i++){
    num2Bits[i] = Num2Bits(NUM_BIT);
    num2Bits[i].in <== in[i];
  }

  // Ensure dividend and divisor are positive.
  mod.in[0] <== num2Bits[0].out[NUM_BIT - 1] * (MAX_VALUE - 2 * in[0]) +  in[0];
  mod.in[1] <== num2Bits[1].out[NUM_BIT - 1] * (MAX_VALUE - 2 * in[1]) +  in[1];

  component xor = XOR();
  xor.a <== num2Bits[0].out[NUM_BIT - 1];
  xor.b <== num2Bits[1].out[NUM_BIT - 1];

  out <== mod.out + xor.out * (MAX_VALUE - 2 * mod.out);
}