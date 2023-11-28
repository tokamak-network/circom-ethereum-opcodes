pragma circom 2.1.6;
include "templates/128bit/add.circom";

template Mul () {
    signal input in1[2], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
    signal output out[2]; // 256-bit integer consisting of two 128-bit integers; out[0]: lower, out[1]: upper
    
    component adder_lower = Adder128();
    adder_lower.in[0] <== in1[0] * in2[0];
    adder_lower.in[1] <== 0;
    adder_lower.carry_in <== 0;
    out[0] <== adder_lower.sum;

    component adder_upper = Adder128();
    adder_upper.in[0] <== in1[0] * in2[1];
    adder_upper.in[1] <== in1[1] * in2[0];
    adder_upper.carry_in <== adder_lower.carry_out;
    out[1] <== adder_upper.sum;
}