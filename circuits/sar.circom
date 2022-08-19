pragma circom 2.0.5;
include "../node_modules/circomlib/circuits/bitify.circom";
include "shr.circom";
include "exp.circom";


// sar(in, n) == shr(in, n) + shl(2**NUM_BITS - 1, NUM_BITS - n) * SIGN_BIT

template SAR () {
  signal input in[2];
  signal shl;
  signal output out;
  
  var NUM_BITS = 253;
  assert(in[0] <= NUM_BITS);

  // To check sign bit
  component num2Bits = Num2Bits(NUM_BITS);
  num2Bits.in <== in[1];

  component shr = SHR();
  shr.in[0] <== in[0];
  shr.in[1] <== in[1];

  component exp = Exp();
  exp.in[0] <== 2;
  exp.in[1] <== 253 - in[0];

  shl <== 14474011154664524427946373126085988481658748083205070504932198000989141204992 - exp.out;
  out <== shr.out + shl * num2Bits.out[NUM_BITS - 1];
}