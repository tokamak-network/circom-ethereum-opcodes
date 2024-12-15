pragma circom 2.1.6;
include "../node_modules/circomlib/circuits/gates.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template LT () {
  // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
  signal input in[4];
  signal in1[2] <== [in[0], in[1]];
  signal in2[2] <== [in[2], in[3]];

  signal lt_lower_out <== LessThan(128)([in1[0], in2[0]]);
  signal lt_upper_out <== LessThan(128)([in1[1], in2[1]]);
  signal eq_out <== IsEqual()([in1[1], in2[1]]);
  signal not_out <== NOT()(eq_out);

  signal temp <== not_out * lt_upper_out;

  signal output out[2] <== [ 
    eq_out * lt_lower_out + temp,
    0
  ];
}

template LEqT () {
  signal input in1[2], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
  signal eq_128 <== IsEqual()([((2**128) - 1),in2[0]]);
  signal lt_lower_out <== LessThan(128)([in1[0], in2[0] + 1 - eq_128]);
  signal lt_upper_out <== LessThan(128)([in1[1], in2[1] + eq_128]);
  signal eq_out <== IsEqual()([in1[1], in2[1] + eq_128]);
  signal not_out <== NOT()(eq_out);

  signal temp <== not_out * lt_upper_out;

  signal output out[2] <== [ 
    eq_out * lt_lower_out + temp,
    0
  ];
}