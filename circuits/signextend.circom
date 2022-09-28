pragma circom 2.0.5;
include "shr.circom";
include "exp.circom";
  // in[1] >= 0 : out = in[1]
  // in[1] < 0  : out = 2**253 - 2 ** ( 8 * (1 + in[0])) + in[1]

template SignExtend () {
  signal input in[2];
  signal output out;

  assert (8 * (in[0] + 1)  < 253);

  component shr = SHR();
  shr.in[0] <== 8 * (1 + in[0]) - 1;
  shr.in[1] <== in[1];

  component exp = Exp();
  exp.in[0] <== 2;
  exp.in[1] <== 8 * (1 + in[0]);

  out <== in[1] - shr.out * (in[1] - (2**253 - exp.out + in[1]));
}