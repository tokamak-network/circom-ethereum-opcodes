pragma circom 2.0.5;
include "mod.circom";
include "shr.circom";
include "../node_modules/circomlib/circuits/gates.circom";

// TODO: 0 if in[1] == 0
template Smod () {
  signal input in[2];
  signal output out;

  assert(in[1] != 0);

  var NUM_BIT = 253;
  var MAX_VALUE = 2**253;

  // Check MSB for each input signal
  assert(in[0] >> 253 == 0);
  assert(in[1] >> 253 == 0);

  component shr[2];
  for (var i = 0; i < 2; i++){
    shr[i] = SHR();
    shr[i].in[0] <== 252;
    shr[i].in[1] <== in[i];
  }

  // Ensure dividend and divisor are positive.
  component mod = Mod();
  mod.in[0] <== shr[0].out * (MAX_VALUE - 2 * in[0]) +  in[0];
  mod.in[1] <== shr[1].out * (MAX_VALUE - 2 * in[1]) +  in[1];

  component xor = XOR();
  xor.a <== shr[0].out;
  xor.b <== shr[1].out;

  out <== mod.out + xor.out * (MAX_VALUE - 2 * mod.out);
}