pragma circom 2.1.6;
include "mul.circom";
include "sub.circom";
include "div.circom";
include "templates/128bit/divider.circom";
include "../node_modules/circomlib/circuits/gates.circom";

template SDiv () {
  signal input in1[2], in2[2];

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
  mul_out[0] <== Mul()([2, 0], in1);
  mul_out[1] <== Mul()([2, 0], in2);

  signal two_complements[2][2];
  two_complements[0] <== Sub()([0, 0], mul_out[0]);
  two_complements[1] <== Sub()([0, 0], mul_out[1]);

  signal abs_values[2][2];
  abs_values[0] <== Add()(
    [sign_bit[0] * two_complements[0][0], sign_bit[0] * two_complements[0][1]],
    [in1[0], in1[1]]
  );
  abs_values[1] <== Add()(
    [sign_bit[1] * two_complements[1][0], sign_bit[1] * two_complements[1][1]],
    [in2[0], in2[1]]
  );

  // divide the absolute values
  signal div_out[2] <== Div()(
    abs_values[0], 
    abs_values[1] 
  );

  // get the sign of the output
  signal xor_out <== XOR()(sign_bit[0], sign_bit[1]);

  // get output
  signal neg_out[2] <== Sub()([0, 0], div_out);
  signal sub_out[2] <== Sub()(neg_out, div_out);

  signal output out[2] <== Add()(
    [xor_out * sub_out[0], xor_out * sub_out[1]],
    div_out
  );

  log("sign_bit[0] = ", sign_bit[0]);
  log("sign_bit[1] = ", sign_bit[1]);
  log("two_complements[0][0] = ", two_complements[0][0]);
  log("two_complements[0][1] = ", two_complements[0][1]);
  log("two_complements[1][0] = ", two_complements[1][0]);
  log("two_complements[1][1] = ", two_complements[1][1]);
  log("abs_values[0][0] = ", abs_values[0][0]);
  log("abs_values[0][1] = ", abs_values[0][1]);
  log("abs_values[1][0] = ", abs_values[1][0]);
  log("abs_values[1][1] = ", abs_values[1][1]);
  log("div_out[0] = ", div_out[0]);
  log("div_out[1] = ", div_out[1]);
  log("xor_out = ", xor_out);
  log("out[0] = ", out[0]);
  log("out[1] = ", out[1]);
}