pragma circom 2.1.6;
include "divider.circom";

template Multiplier128 () {
  signal input in[2]; // 128-bit inputs

  component divider[5];
  for (var i = 0; i < 5; i++) { divider[i] = Divider128(); }

  divider[0].in <== [in[0], 2**64];
  divider[1].in <== [in[1], 2**64];

  signal a <== divider[0].q;
  signal b <== divider[0].r;
  signal c <== divider[1].q;
  signal d <== divider[1].r;

  signal temp1 <== a * d;
  signal temp2 <== b * d;
  
  divider[2].in <== [temp1 + b * c, 2**64];

  signal o <== temp2 + divider[2].r * 2**64;
  divider[3].in <== [o, 2**128];
  signal output out <== divider[3].r;

  signal c_out <== a * c + divider[2].q;
  divider[4].in <== [c_out + divider[3].q, 2**128];
  signal output carry_out <== divider[4].r;
}