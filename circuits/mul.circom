pragma circom 2.1.6;
include "templates/128bit/adder.circom";
include "templates/128bit/multiplier.circom";

template Mul () {
    signal input in1[2], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
    
    component multipiler_lower = Multiplier128();
    multipiler_lower.in <== [in1[0], in2[0]];

    component multipiler_upper[2];
    for (var i = 0; i < 2; i++) { multipiler_upper[i] = Multiplier128(); }
    multipiler_upper[0].in <== [in1[0], in2[1]];
    multipiler_upper[1].in <== [in1[1], in2[0]];

    component adder_upper = Adder128();
    adder_upper.in <== [multipiler_upper[0].out, multipiler_upper[1].out];
    adder_upper.carry_in <== multipiler_lower.carry_out;
    
    signal output out[2] <== [
        multipiler_lower.out,
        adder_upper.sum
    ]; // 256-bit integer consisting of two 128-bit integers; out[0]: lower, out[1]: upper
}