pragma circom 2.0.5;
include "../node_modules/circomlib/circuits/bitify.circom";
include "shr.circom";
include "exp.circom";


// sar(in, n) == shr(in, n) + shl(2**NUM_BIT - 1, NUM_BIT - n) * SIGN_BIT

template SAR () {
  signal input in;
  signal input n;
  signal shl;
  signal output out;
  
  var NUM_BIT = 253;
  assert(n <= NUM_BIT);

  // To check sign bit
  component num2Bits = Num2Bits(NUM_BIT);
  num2Bits.in <== in;

  component shr = SHR();
  shr.in <== in;
  shr.n <== n;

  component exp = Exp();
  exp.in <== 2;
  exp.n <== 253 - n;

  shl <== 14474011154664524427946373126085988481658748083205070504932198000989141204992 - exp.out;
  out <== shr.out + shl * num2Bits.out[NUM_BIT - 1];
}
// component main {public [in, n]} = SAR();