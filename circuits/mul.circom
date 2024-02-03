pragma circom 2.1.6;
include "templates/128bit/adder.circom";
include "templates/128bit/multiplier.circom";
include "add.circom";

//256bits(a*2^128+b) x 256bits(c*2^128+d)
//(ad+bc)*2^128 + bd
template Mul () {
    signal input in1[2], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
    
    component multiplier_lower = Multiplier128();
    multiplier_lower.in <== [in1[0], in2[0]]; // [b,d] => b:in1[0], d:in2[0]

    component multiplier_upper[2];
    for (var i = 0; i < 2; i++) { multiplier_upper[i] = Multiplier128(); }
    multiplier_upper[0].in <== [in1[0], in2[1]]; // [b,c] => b:in1[0], c:in2[1]
    multiplier_upper[1].in <== [in1[1], in2[0]]; // [a,d] => a:in1[1], d:in2[0]

    signal sum[2] <== Add()(multiplier_upper[0].out, multiplier_upper[1].out);

    component adder_upper = Adder128();
    adder_upper.in <== [sum[0], multiplier_lower.out[1]]; // ad + bc => bc:mul_upper[0],ad:mul_upper[1]
    adder_upper.carry_in <== 0;

    signal output out[2] <== [
        multiplier_lower.out[0],
        adder_upper.sum
    ]; // 256-bit integer consisting of two 128-bit integers; out[0]: lower, out[1]: upper
}