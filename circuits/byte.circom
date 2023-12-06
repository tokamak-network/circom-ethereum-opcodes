pragma circom 2.1.6;
include "../node_modules/circomlib/circuits/comparators.circom";
include "templates/128bit/div_and_mod.circom";
include "templates/128bit/exp.circom";

template Byte () {
  signal input in1[2], in2[2];  // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
                                // in1: index, in2: value
  
  // check if in1[1] == 0 and in1[1] < 32 (== in1 < 32)
  signal is_zero_out <== IsZero()(in1[1]); // check if the upper 128-bit integer is zero
  component div_and_mod1 = DivAndMod(); // check if the upper 128-bit integer is less than 32
  div_and_mod1.in <== [in1[0], 32];
  signal is_lower_less_than_32_out <== IsZero()(div_and_mod1.q); // check if the lower 128-bit integer is less than 32
  signal is_less_than_32_out <== is_zero_out * is_lower_less_than_32_out; // check if in1 < 32

  // calculate t = in1[0] % 16
  component div_and_mod2 = DivAndMod();
  div_and_mod2.in <== [in1[0], 16];
  signal t <== div_and_mod2.r;
  signal selector <== IsZero()(div_and_mod2.q); // check if in1[0] // 16 == 0

  // calculate in2[0] // 2**(120 - 8t) % 2**8 and in2[1] // 2**(120 - 8t) % 2**8
  signal bytes[2]; // bytes[0]: lower, bytes[1]: upper
  signal shr_exp <== Exp128()([2, 120 - 8 * t]); // 2**(120 - 8t)

  // retrieve a byte from in2[0]
  component div_and_mod3 = DivAndMod();
  div_and_mod3.in <== [in2[0], shr_exp];
  component div_and_mod4 = DivAndMod();
  div_and_mod4.in <== [div_and_mod3.q, 2**8];
  bytes[0] <== div_and_mod4.r;

  // retrieve a byte from in2[1]
  component div_and_mod5 = DivAndMod();
  div_and_mod5.in <== [in2[1], shr_exp];
  component div_and_mod6 = DivAndMod();
  div_and_mod6.in <== [div_and_mod5.q, 2**8];
  bytes[1] <== div_and_mod6.r;

  // select either one using the selector
  signal output out[2];
  signal temp <== selector * (bytes[1] - bytes[0]) + bytes[0];
  out[0] <== temp * is_less_than_32_out;
  out[1] <== 0;
}