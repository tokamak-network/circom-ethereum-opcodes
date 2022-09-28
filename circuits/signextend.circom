pragma circom 2.0.5;
include "shr.circom";
include "exp.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

  // in[1] >= 0 or 30 < in[0]: out = in[1]
  // in[1] < 0  : out = 2**253 - 2 ** ( 8 * (1 + in[0])) + in[1]

template SignExtend () {
  signal input in[2];
  signal output out;

  component lt = LessThan(252);
  lt.in[0] <== in[0];
  lt.in[1] <== 30;

  signal cond_exp;
  cond_exp <==  1 + lt.out * (8 * (1 + in[0]) - 1);

  component exp = Exp();
  exp.in[0] <== 2;
  exp.in[1] <== cond_exp;

  component shr = SHR();
  shr.in[0] <== cond_exp - 1;
  shr.in[1] <== in[1];

  signal temp;
  temp <== shr.out * lt.out;

  out <== in[1] - temp * (in[1] - (2**253 - exp.out + in[1]));
}