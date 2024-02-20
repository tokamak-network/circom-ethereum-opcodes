pragma circom 2.1.6;
include "mul.circom";
include "sub.circom";
include "div.circom";
include "iszero.circom";

template Mod () {
    signal input in1[2], in2[2];

    var temp[2] = [0, 0];
    if (in2[0] == 0 && in2[1] == 0) {
        temp = add(in1, [1, 0]);
    }

    var q[2][2] = div(in1, add(in2, temp));
    signal quotient[2] <-- q[0];
    signal output out[2] <-- q[1];

    signal inter[2] <== Mul()(quotient, in2);
    signal res[2] <== Add()(inter, out);
    signal eq[2] <== Eq()(res, in1);
    eq[0] === 1;

    //@todo: if divisor == 0 { out = 0 }
    //Ensure 0 <= remainder < in2
    signal lt_r[2] <== LEqT()([0,0],out);
    signal lt_divisor[2] <== LT()(out, in2);

    lt_r[0]*lt_divisor[0] === 1;

    // // Ensure out is zero if in2 is zero
    // signal is_zero_out[2] <== IsZero256()(in2);
    // is_zero_out[0] * out[0] === 0;
    // is_zero_out[0] * out[1] === 0;
}

// template Mod () {
//     signal input in1[2], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper

//     signal div_out[2] <== Div()(in1, in2);

//     signal is_zero_out[2] <== IsZero256()(in2);
    
//     signal inter[2] <== Mul()(div_out, in2);
    
//     signal temp[2] <== Sub()(in1, inter);
//     signal output out[2] <== [
//         temp[0] * (1 - is_zero_out[0]),
//         temp[1] * (1 - is_zero_out[0])
//     ];
// }