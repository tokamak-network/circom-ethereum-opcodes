pragma circom 2.0.5;
include "../node_modules/circomlib/circuits/bitify.circom";
include "../node_modules/circomlib/circuits/gates.circom";

template BinAdder () {

  // From ciromlib but hard-coded to detour wrong value of nout.
  var n = 253;
  var ops = 2;
  var nout = 254;
  signal input in[2][n];
  signal output out[nout];

  var lin = 0;
  var lout = 0;

  var k;
  var j;

  var e2;

  e2 = 1;
  for (k=0; k<n; k++) {
      for (j=0; j<ops; j++) {
          lin += in[j][k] * e2;
      }
      e2 = e2 + e2;
  }

  e2 = 1;
  for (k=0; k<nout; k++) {
      out[k] <-- (lin >> k) & 1;

      // Ensure out is binary
      out[k] * (out[k] - 1) === 0;

      lout += out[k] * e2;

      e2 = e2+e2;
  }
  // Ensure the sum;
  lin === lout;
}

// The MSB is the sign bit.
template SLT () {
  var MSB = 253;
  signal input in[2];
  signal output out;

  component num2Bits0 = Num2Bits(MSB);
  component num2Bits1 = Num2BitsNeg(MSB);

  num2Bits0.in <== in[0];
  num2Bits1.in <== in[1];

  component adder = BinAdder();
  for (var i = 0; i < MSB; i++) {
      num2Bits0.out[i] ==> adder.in[0][i];
      num2Bits1.out[i] ==> adder.in[1][i];
  }

  component xor = XOR();
  xor.a <== num2Bits0.out[MSB - 1];
  xor.b <== num2Bits1.out[MSB - 1];

  out <== num2Bits0.out[MSB - 1] + xor.out * (adder.out[MSB - 1] - num2Bits0.out[MSB - 1]);  
}