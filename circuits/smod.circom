pragma circom 2.1.6;
include "mul.circom";
include "sub.circom";
include "mod.circom";
include "templates/128bit/divider.circom";
include "../node_modules/circomlib/circuits/gates.circom";

template SMod () {
  signal input in[4];
  signal in1[2] <== [in[0], in[1]];
  signal in2[2] <== [in[2], in[3]];

  // get the sign bits
  component divider[2];
  for (var i = 0; i < 2; i++) { divider[i] = Divider128(); }

  divider[0].in <== [in1[1], 2**127];
  divider[1].in <== [in2[1], 2**127];

  signal sign_bit[2] <== [divider[0].q, divider[1].q];
  for (var i = 0; i < 2; i++) { 
    sign_bit[i] * (1 - sign_bit[i]) === 0; // sign_bit[i] is either 0 or 1
  }

  // get the absolute values
  signal mul_out[2][2];
  mul_out[0] <== Mul()([2, 0, in1[0], in1[1]]);
  mul_out[1] <== Mul()([2, 0, in2[0], in2[1]]);

  signal two_complements[2][2];
  two_complements[0] <== Sub()([0, 0, mul_out[0][0], mul_out[0][1]]);
  two_complements[1] <== Sub()([0, 0, mul_out[1][0], mul_out[1][1]]);

  signal abs_values[2][2];
  abs_values[0] <== Add()(
    [sign_bit[0] * two_complements[0][0], sign_bit[0] * two_complements[0][1],
    in1[0], in1[1]]
  );
  abs_values[1] <== Add()(
    [sign_bit[1] * two_complements[1][0], sign_bit[1] * two_complements[1][1],
    in2[0], in2[1]]
  );

  // get remainder of the absolute values
  signal mod_out[2] <== Mod()(
    [abs_values[0][0], abs_values[0][1], 
    abs_values[1][0], abs_values[1][1]]
  );

  // get the sign of the output
  signal xor_out <== XOR()(sign_bit[0], sign_bit[1]);

  // get output
  signal neg_out[2] <== Sub()([0, 0, mod_out[0], mod_out[1]]);
  signal sub_out[2] <== Sub()([neg_out[0], neg_out[1], mod_out[0], mod_out[1]]);

  signal output out[2] <== Add()(
    [xor_out * sub_out[0], xor_out * sub_out[1],
    mod_out[0], mod_out[1]]
  );
}