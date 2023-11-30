pragma circom 2.1.6;
include "shr.circom";
include "templates/128bit/div_and_mod.circom";
include "templates/128bit/exp.circom";
include "../node_modules/circomlib/circuits/comparators.circom";


template SAR () {
  signal input in1[2], in2[2];  // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
                                // in1 << in2
  signal output out[2]; // 256-bit integer consisting of two 128-bit integers; out[0]: lower, out[1]: upper


  // 1. calculate msb
  component msb_div_and_mod = DivAndMod();
  msb_div_and_mod.in[0] <== in1[1];
  msb_div_and_mod.in[1] <== 2**127;
  signal msb <== msb_div_and_mod.q;
  msb * (1 - msb) === 0; // msb is either 0 or 1


  // 2. calculate SHR
  signal shr_out[2] <== SHR()(in1, in2);


  // 3. calculate the supplied ones for upper 128 bits
  // 3-1. determine if 0 <= in2 < 128 <=> in2[1] == 0 and in2[0] // 128 == 0
  signal upper_in2_is_zero <== IsZero()(in2[1]);
  component div_and_mod1 = DivAndMod();
  div_and_mod1.in[0] <== in2[0];
  div_and_mod1.in[1] <== 128;
  signal is_smaller_than_128 <== IsZero()(div_and_mod1.q);
  signal lt_128 <== is_smaller_than_128 * upper_in2_is_zero; // 1 if 0 <= in2 < 128, 0 otherwise

  // 3-2. calculate the suppliments for out[1]
  signal upper_suppliments[2];

  // 3-2-1. calculate suppliments if 0 <= in2 < 128
  signal temp1 <== Exp128()([2, in2[0]]);
  signal temp2 <== Exp128()([2, 128 - in2[0]]);
  upper_suppliments[0] <== (temp1 - 1) * temp2;

  // 3-2-2. calculate suppliments if 128 <= in2
  upper_suppliments[1] <== (2**128 - 1);

  // 3-2-3. calculate the suppliment for out[1] if msb is set to 1
  signal final_upper_suppliment <== lt_128 * (upper_suppliments[0] - upper_suppliments[1]) + upper_suppliments[1];
  

  // 4. calculate the supplied ones for lower 128 bits
  // 4-1. determine if 0 <= in2 < 128 or 128 <= in2 < 256 or 256 <= in2
  component div_and_mod2 = DivAndMod();
  div_and_mod2.in[0] <== in2[0];
  div_and_mod2.in[1] <== 256;
  signal is_smaller_than_256 <== IsZero()(div_and_mod2.q);

  // 4-2. calculate the suppliments for out[0]
  signal lower_suppliments[3];

  // 4-2-1. calculate suppliments if 0 <= in2 < 128
  lower_suppliments[0] <== 0;

  // 4-2-2. calculate suppliments if 128 <= in2 < 256
  signal temp3 <== Exp128()([2, in2[0] - 128]);
  signal temp4 <== Exp128()([2, 256 - in2[0]]);
  lower_suppliments[1] <== (temp3 - 1) * temp4;

  // 4-2-3. calculate suppliments if 256 <= in2
  lower_suppliments[2] <== (2**128 - 1);

  // 4-2-4. calculate the suppliment for out[0] if msb is set to 1
  signal temp5 <== is_smaller_than_256 * (lower_suppliments[1] - lower_suppliments[2]) + lower_suppliments[2];
  signal final_lower_suppliment <== is_smaller_than_128 * (lower_suppliments[0] - temp5) + temp5;


  // 5. calculate the final output
  out[0] <== shr_out[0] + final_lower_suppliment * msb;
  out[1] <== shr_out[1] + final_upper_suppliment * msb;
}