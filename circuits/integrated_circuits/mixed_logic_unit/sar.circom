pragma circom 2.0.5;
include "../../../node_modules/circomlib/circuits/bitify.circom";
include "../../shr.circom";
include "../../exp.circom";


// sar(in, n) == shr(in, n) + shl(2**NUM_BITS - 1, NUM_BITS - n) * SIGN_BIT

template SARWithoutBitification (NUM_BITS) {
  signal input in[2], sign_bit;
  signal shl;
  signal output out;

  // assert(in[0] <= NUM_BITS);

  component shr = SHR();
  shr.in[0] <== in[0];
  shr.in[1] <== in[1];

  component exp = Exp();
  exp.in[0] <== 2;
  exp.in[1] <== 253 - in[0];

  shl <== 14474011154664524427946373126085988481658748083205070504932198000989141204992 - exp.out;
  out <== shr.out + shl * sign_bit;
}