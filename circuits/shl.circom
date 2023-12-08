pragma circom 2.1.6;
include "iszero.circom";
include "templates/comparators.circom";
include "templates/128bit/exp.circom";
include "templates/128bit/divider.circom";
include "../node_modules/circomlib/circuits/gates.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template _SHL () {
  signal input in1[2], in2[2];  // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
                                // in2 << in1

  // 1) in1 == 0: out = in2
  signal is_zero_out[2] <== IsZero256()(in1);
  
  // 2) in1 > 0: out = in2 << in1
  signal exp1 <== Exp128()([2, 128 - in1[0]]);
  signal exp2 <== Exp128()([2, in1[0]]);

  component upper_divider = Divider128();
  upper_divider.in <== [in2[1], exp1];

  component lower_divider = Divider128();
  lower_divider.in <== [in2[0], exp1];

  signal inter[2] <== [
    lower_divider.r * exp2,
    upper_divider.r * exp2 + lower_divider.q
  ];

  // collapse the two cases
  signal output out[2] <== [
    inter[0] + is_zero_out[0] * (in2[0] - inter[0]),
    inter[1] + is_zero_out[0] * (in2[1] - inter[1])
  ]; // 256-bit integer consisting of two 128-bit integers; out[0]: lower, out[1]: upper
}

template SHL () {
  signal input in1[2], in2[2];  // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
                                // in2 << in1

  // 1) in1 >= 256 == !in1 < 256: out = 0
  signal is_less_than_256 <== IsLessThanN()(in1, 256); // in1 < 256


  // 2) 0 <= in1 < 256
  component divider2 = Divider128();
  divider2.in <== [in1[0], 128];

  // 2-1) shift in1 % 128 times
  component _shl = _SHL();
  _shl.in1 <== [divider2.r, 0];
  _shl.in2 <== in2;

  // 2-2) shift the rest
  //  if divider2.q = 1:  out[0] = 0,           out[1] = shl.out[0]
  //  else:                   out[0] = shl.out[0],  out[1] = shl.out[1]
  signal inter[2] <== [
    _shl.out[0] * (1 - divider2.q),
    divider2.q * (_shl.out[0] - _shl.out[1]) + _shl.out[1]
  ];


  // collapse the two cases
  signal output out[2] <== [
    is_less_than_256 * inter[0],
    is_less_than_256 * inter[1]
  ]; // 256-bit integer consisting of two 128-bit integers; out[0]: lower, out[1]: upper
}