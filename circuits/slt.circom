pragma circom 2.0.5;
include "../node_modules/circomlib/circuits/gates.circom";
include "shr.circom";

template LT(n) {
    // assert(n <= 252);
    signal input in[2];
    signal output out;

    component n2b = Num2Bits(n+1);

    n2b.in <== in[0]+ (1<<n) - in[1];

    out <== 1-n2b.out[n];
}

template SLT () {
  signal input in[2];
  signal output out;

  var NUM_BITS = 253;

  assert(in[0] >> NUM_BITS == 0);
  assert(in[1] >> NUM_BITS == 0);

  component shr[2];
  for (var i = 0; i < 2; i++){
    shr[i] = SHR();
    shr[i].in[0] <== NUM_BITS - 1;
    shr[i].in[1] <== in[i];
  }
  
  component lt = LT(NUM_BITS);
  lt.in[0] <== in[0];
  lt.in[1] <== in[1];

  component xor = XOR();
  xor.a <== shr[0].out;
  xor.b <== shr[1].out;

  out <== xor.out * (shr[0].out - lt.out) + lt.out;
}