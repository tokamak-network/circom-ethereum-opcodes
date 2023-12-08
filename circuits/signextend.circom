pragma circom 2.1.6;
include "sub.circom";
include "templates/divider.circom";
include "templates/bit_extractor.circom";
include "templates/128bit/exp.circom";
include "templates/128bit/divider.circom";
include "templates/two_to_the_power_of_n.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

// t = 256 - 8 * (1 + in0)
// out = ((2**256 - 2**t) * in1[t] + in % 2**t) 

template _SignExtend () {
  signal input in1[2], in2[2]; // in1: position, in2: bitstring

  signal t <== 8 * (1 + in1[0]);

  // get the bit of in2 at position "t"
  signal sign_bit <== GetBitByIndex()(in2, t);

  // calculate the supplied bitstring
  signal two_to_the_power_of_t[2] <== CalculateTwoToThePowerOfN()(t);
  signal temp[2] <== Sub()(two_to_the_power_of_t, [1, 0]); // 2**t - 1
  signal bitstring[2] <== Sub()([2**128 - 1, 2**128 - 1], temp); // 2**256 - 2**t

  // in2 % 2**t
  signal remainder[2] <== Mod256()(
    in2, 
    two_to_the_power_of_t[0] + two_to_the_power_of_t[1] * 2**128
  );

  // select the correct output
  signal output out[2] <== [
    bitstring[0] * sign_bit + remainder[0],
    bitstring[1] * sign_bit + remainder[1]
  ];
}

template SignExtend () {
  signal input in1[2], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper

  // check if in1 < 32
  signal is_less_than_32 <== IsLessThanN()(in1, 32);

  signal _sign_extend_out[2] <== _SignExtend()(in1, in2);

  // select the correct output
  // if in1 < 32, then out = processed in2
  // else out = in2
  signal output out[2] <== [
    in2[0] + is_less_than_32 * (_sign_extend_out[0] - in2[0]),
    in2[1] + is_less_than_32 * (_sign_extend_out[1] - in2[1])
  ];
}