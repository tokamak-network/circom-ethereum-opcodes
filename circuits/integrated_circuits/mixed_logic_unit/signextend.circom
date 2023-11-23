pragma circom 2.1.6;
include "../../shr.circom";
include "../../exp.circom";

template SignExtendWithoutBitification () {

  signal input in[2], lt_out;
  signal output out;

  signal cond_exp;
  cond_exp <==  1 + lt_out * (8 * (1 + in[0]) - 1);

  component exp = Exp();
  exp.in[0] <== 2;
  exp.in[1] <== cond_exp;

  component shr = SHR();
  shr.in[0] <== cond_exp - 1;
  shr.in[1] <== in[1];

  signal temp;
  temp <== shr.out * lt_out;

  out <== in[1] - temp * (in[1] - (2**253 - exp.out + in[1]));
}