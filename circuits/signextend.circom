pragma circom 2.1.6;
include "sub.circom";
include "templates/bit_extractor.circom";
include "templates/128bit/exp.circom";
include "templates/128bit/divider.circom";
include "templates/two_to_the_power_of_n.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

// t = 256 - 8 * (1 + in0)
// out = is_less_than_31 ?? ((2**256 - 2**t) * in1 at index of t + in % 2**t) : in2

template _SignExtend () {
  signal input in1[2], in2[2]; // in1: position, in2: bitstring

  signal t <== 8 * (1 + in1[0]);

  // get the bit of in2 at position "t"
  signal sign_bit <== GetBitByIndex()(in2, t - 1);

  // calculate the supplied bitstring
  signal two_to_the_power_of_t[2] <== CalculateTwoToThePowerOfN()(t);
  signal temp[2] <== Sub()(two_to_the_power_of_t, [1, 0]); // 2**t - 1
  signal bitstring[2] <== Sub()([2**128 - 1, 2**128 - 1], temp); // 2**256 - 2**t

  // in2 % 2**t
  signal sliced_bit_str[2] <== SliceBitStr()(in2, t);

  // select the correct output
  signal output out[2] <== [
    bitstring[0] * sign_bit + sliced_bit_str[0],
    bitstring[1] * sign_bit + sliced_bit_str[1]
  ];
}

template SignExtend () {
  signal input in1[2], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper

  // check if in1 < 31
  signal is_less_than_31 <== IsLessThanN()(in1, 31);

  signal _sign_extend_out[2] <== _SignExtend()(in1, in2);

  // select the correct output
  // if in1 < 31, then out = processed in2
  // else out = in2
  signal output out[2] <== [
    in2[0] + is_less_than_31 * (_sign_extend_out[0] - in2[0]),
    in2[1] + is_less_than_31 * (_sign_extend_out[1] - in2[1])
  ];
}