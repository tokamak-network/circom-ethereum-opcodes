pragma circom 2.1.6;
include "shr.circom";
include "templates/128bit/exp.circom";
include "templates/comparators.circom";
include "templates/128bit/divider.circom";
include "../node_modules/circomlib/circuits/comparators.circom";


template SAR () {
  signal input in2[2], in1[2];  // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
                                // in1 << in2


  // 1. calculate msb
  component msb_divider = Divider128();
  msb_divider.in <== [in2[1], 2**127];
  signal msb <== msb_divider.q;
  msb * (1 - msb) === 0; // msb is either 0 or 1


  // 2. calculate SHR
  signal shr_out[2] <== SHR()(in2, in1);


  // 3. calculate the supplied ones for upper 128 bits
  // 3-1. determine if 0 <= in1 < 128
  signal is_less_than_128 <== IsLessThanN()(in1, 128);

  // 3-2. calculate the suppliments for out[1]
  signal upper_suppliments[2];

  // 3-2-1. calculate suppliments if 0 <= in1 < 128
  signal temp1 <== Exp128()([2, in1[0]]);
  signal temp2 <== Exp128()([2, 128 - in1[0]]);
  upper_suppliments[0] <== (temp1 - 1) * temp2;

  // 3-2-2. calculate suppliments if 128 <= in1
  upper_suppliments[1] <== (2**128 - 1);

  // 3-2-3. calculate the suppliment for out[1] if msb is set to 1
  signal final_upper_suppliment <== is_less_than_128 * (upper_suppliments[0] - upper_suppliments[1]) + upper_suppliments[1];
  

  // 4. calculate the supplied ones for lower 128 bits
  // 4-1. determine if 0 <= in1 < 128 or 128 <= in1 < 256 or 256 <= in1
  signal is_less_than_256 <== IsLessThanN()(in1, 256);

  // 4-2. calculate the suppliments for out[0]
  signal lower_suppliments[2];

  // 4-2-1. calculate suppliments if 0 <= in1 < 128
  // suppliments are 0

  // 4-2-2. calculate suppliments if 128 <= in1 < 256
  signal temp3 <== Exp128()([2, in1[0] - 128]);
  signal temp4 <== Exp128()([2, 256 - in1[0]]);
  lower_suppliments[0] <== (temp3 - 1) * temp4;

  // 4-2-3. calculate suppliments if 256 <= in1
  lower_suppliments[1] <== (2**128 - 1);

  // 4-2-4. calculate the suppliment for out[0] if msb is set to 1
  signal temp5 <== is_less_than_256 * (lower_suppliments[0] - lower_suppliments[1]) + lower_suppliments[1];
  signal final_lower_suppliment <== temp5 - is_less_than_128 * temp5;


  // 5. calculate the final output
  signal output out[2] <== [
    shr_out[0] + final_lower_suppliment * msb,
    shr_out[1] + final_upper_suppliment * msb
  ]; // 256-bit integer consisting of two 128-bit integers; out[0]: lower, out[1]: upper
}