pragma circom 2.1.6;
include "divider.circom";

//128bits(a*2^64+b) x 128bits(c*2^64+d)
//ac*2^128 + (ad+bc)*2^64 + bd
template Multiplier128 () {
  signal input in[2]; // 128-bit inputs

  component divider[3];
  for (var i = 0; i < 3; i++) { divider[i] = Divider(64); }

  divider[0].in <== in[0];
  divider[1].in <== in[1];

  signal a <== divider[0].q;
  signal b <== divider[0].r;
  signal c <== divider[1].q;
  signal d <== divider[1].r;

  signal temp1 <== a * d;
  signal temp2 <== b * d;
  
  divider[2].in <== temp1 + b * c; //ad+bc

  component divider128[2];
  for (var i = 0; i < 2; i++) { divider128[i] = Divider(128); }

  divider128[0].in <== temp2 + divider[2].r * 2**64; //bd + (ad+bc)*2^64

  signal c_out <== a * c + divider[2].q; //ac + carry1
  divider128[1].in <== a * c + divider[2].q + divider128[0].q; //ac + carry1 + carry2

  signal output out[2] <== [
    divider128[0].r, //((ad+bc)*2^64 + bd) mod 2^128
    divider128[1].r  //(ac + carry1 + carry2) mod 2^128
  ];
}

//Multiplier128 output should be 256bit