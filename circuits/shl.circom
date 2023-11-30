pragma circom 2.1.6;
include "iszero.circom";
include "templates/128bit/exp.circom";
include "templates/128bit/div_and_mod.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/gates.circom";

template _SHL () {
  signal input in1[2], in2[2];  // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
                                // in1 << in2
  signal output out[2]; // 256-bit integer consisting of two 128-bit integers; out[0]: lower, out[1]: upper

  // 1) in2 == 0: out = in1
  signal is_zero_out[2] <== IsZero256()(in2);
  
  // 2) in2 > 0: out = in1 << in2
  signal exp1 <== Exp128()([2, 128 - in2[0]]);
  signal exp2 <== Exp128()([2, in2[0]]);

  component upper_div_and_mod = DivAndMod();
  upper_div_and_mod.in[0] <== in1[1];
  upper_div_and_mod.in[1] <== exp1;

  component lower_div_and_mod = DivAndMod();
  lower_div_and_mod.in[0] <== in1[0];
  lower_div_and_mod.in[1] <== exp1;

  signal inter[2] <== [
    lower_div_and_mod.r * exp2,
    upper_div_and_mod.r * exp2 + lower_div_and_mod.q
  ];

  // collapse the two cases
  out[0] <== inter[0] + is_zero_out[0] * (in1[0] - inter[0]);
  out[1] <== inter[1] + is_zero_out[0] * (in1[1] - inter[1]);
}

template SHL () {
  signal input in1[2], in2[2];  // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
                                // in1 << in2
  signal output out[2]; // 256-bit integer consisting of two 128-bit integers; out[0]: lower, out[1]: upper

  // 1) in2 >= 256 == !in2 < 256: out = 0
  // 1-1) in2[0] // 256 == 0
  component div_and_mod1 = DivAndMod();
  div_and_mod1.in[0] <== in2[0];
  div_and_mod1.in[1] <== 256;

  signal is_less_than_256 <== IsZero()(div_and_mod1.q);
  
  // 1-2) in2[1] == 0
  signal is_upper_zero <== IsZero()(in2[1]);

  signal lt_out <== is_upper_zero * is_less_than_256; // in2 < 256


  // 2) 0 <= in2 < 256
  component div_and_mod2 = DivAndMod();
  div_and_mod2.in[0] <== in2[0];
  div_and_mod2.in[1] <== 128;

  // 2-1) shift in2 % 128 times
  component _shl = _SHL();
  _shl.in1 <== in1;
  _shl.in2 <== [div_and_mod2.r, 0];

  // 2-2) shift the rest
  //  if div_and_mod2.q = 1:  out[0] = 0,           out[1] = shl.out[0]
  //  else:                   out[0] = shl.out[0],  out[1] = shl.out[1]
  signal inter[2] <== [
    _shl.out[0] * (1 - div_and_mod2.q),
    div_and_mod2.q * (_shl.out[0] - _shl.out[1]) + _shl.out[1]
  ];


  // collapse the two cases
  out[0] <== lt_out * inter[0];
  out[1] <== lt_out * inter[1];
}