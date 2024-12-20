pragma circom 2.1.6;
include "templates/comparators.circom";
include "templates/128bit/exp.circom";
include "templates/128bit/divider.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/gates.circom";

template _SHR () {
  signal input in1, in2[2];  // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
                                // in2 << in1

  // 1) in1 == 0: out = in2
  signal is_zero_out <== IsZero()(in1);
  
  // 2) in1 > 0: out = in2 >> in1
  signal exp1 <== BinaryExp128()(in1);
  signal exp2 <== BinaryExp128()(128 - in1);

  component upper_divider = Divider128();
  upper_divider.in <== [in2[1], exp1];

  component lower_divider = Divider128();
  lower_divider.in <== [in2[0], exp1];

  signal inter[2] <== [
    upper_divider.r * exp2 + lower_divider.q,
    upper_divider.q
  ];

  // collapse the two cases
  signal output out[2] <== [
  inter[0] + is_zero_out * (in2[0] - inter[0]),
  inter[1] + is_zero_out * (in2[1] - inter[1])
  ];
}

template SHR () {
  // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
  // in2 << in1
  signal input in[4];
  signal in1[2] <== [in[0], in[1]];
  signal in2[2] <== [in[2], in[3]];

  // 1-1) in1 < 256
  signal is_less_than_256 <== IsLessThanExp(8)(in1);

  // 2) 0 <= in1 < 256
  component divider2 = Divider(7);
  divider2.in <== in1[0];

  // 2-1) shift in1 % 128 times
  component _shr = _SHR();
  _shr.in1 <== divider2.r;
  _shr.in2 <== in2;

  // 2-2) shift the rest
  //  if divider2.q == 1:  out[0] = in2[1], out[1] = 0
  //  else:                    out[0] = in2[0], out[1] = in2[1]
  signal inter[2] <== [
    divider2.q * (_shr.out[1] - _shr.out[0]) + _shr.out[0],
    (1 - divider2.q) * _shr.out[1]
  ];


  // collapse the two cases
  signal output out[2] <== [
    is_less_than_256 * inter[0],
    is_less_than_256 * inter[1]
  ];
}