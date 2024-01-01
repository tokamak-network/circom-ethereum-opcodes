pragma circom 2.1.6;
include "iszero.circom";
include "templates/128bit/exp.circom";
include "templates/128bit/divider.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/gates.circom";

template _SHR () {
  signal input in2[2], in1[2];  // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
                                // in2 << in1
  signal output out[2]; // 256-bit integer consisting of two 128-bit integers; out[0]: lower, out[1]: upper

  // 1) in1 == 0: out = in2
  signal is_zero_out[2] <== IsZero256()(in1);
  
  // 2) in1 > 0: out = in2 >> in1
  signal exp1 <== Exp128()([2, in1[0]]);
  signal exp2 <== Exp128()([2, 128 - in1[0]]);

  component upper_divider = Divider128();
  upper_divider.in[0] <== in2[1];
  upper_divider.in[1] <== exp1;

  component lower_divider = Divider128();
  lower_divider.in[0] <== in2[0];
  lower_divider.in[1] <== exp1;

  signal inter[2] <== [
    upper_divider.r * exp2 + lower_divider.q,
    upper_divider.q
  ];

  // collapse the two cases
  out[0] <== inter[0] + is_zero_out[0] * (in2[0] - inter[0]);
  out[1] <== inter[1] + is_zero_out[0] * (in2[1] - inter[1]);
}

template SHR () {
  signal input in1[2], in2[2];  // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
                                // in2 << in1

  // 1) in1 >= 256 == !in1 < 256: out = 0
  // 1-1) in1[0] // 256 == 0
  component divider1 = Divider128();
  divider1.in[0] <== in1[0];
  divider1.in[1] <== 256;

  signal is_less_than_256 <== IsZero()(divider1.q);
  
  // 1-2) in1[1] == 0
  signal is_upper_zero <== IsZero()(in1[1]);

  signal lt_out <== is_upper_zero * is_less_than_256; // in1 < 256


  // 2) 0 <= in1 < 256
  component divider2 = Divider128();
  divider2.in[0] <== in1[0];
  divider2.in[1] <== 128;

  // 2-1) shift in1 % 128 times
  component _shr = _SHR();
  _shr.in2 <== in2;
  _shr.in1 <== [divider2.r, 0];

  // 2-2) shift the rest
  //  if divider2.q == 1:  out[0] = in2[1], out[1] = 0
  //  else:                    out[0] = in2[0], out[1] = in2[1]
  signal inter[2] <== [
    divider2.q * (_shr.out[1] - _shr.out[0]) + _shr.out[0],
    (1 - divider2.q) * _shr.out[1]
  ];


  // collapse the two cases
  signal output out[2] <== [
    lt_out * inter[0],
    lt_out * inter[1]
  ];
}