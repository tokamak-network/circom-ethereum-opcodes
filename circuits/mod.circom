pragma circom 2.1.6;
include "mul.circom";
include "sub.circom";
include "div.circom";
include "iszero.circom";

template Mod () {
    signal input in1[2], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper

    signal div_out[2] <== Div()(in1, in2);

    signal is_zero_out[2] <== IsZero256()(in2);
    
    signal inter[2] <== Mul()(div_out, in2);
    
    signal temp[2] <== Sub()(in1, inter);
    signal output out[2] <== [
        temp[0] * (1 - is_zero_out[0]),
        temp[1] * (1 - is_zero_out[0])
    ];
}