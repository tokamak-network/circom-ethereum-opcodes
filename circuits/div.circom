pragma circom 2.1.6;
include "add.circom";
include "mul.circom";
include "eq.circom";
include "lt.circom";
include "iszero.circom";
include "templates/arithmetic_func.circom";

template Div () {
    signal input in1[2], in2[2];

    var temp[2] = [0, 0];
    if (in2[0] == 0 && in2[1] == 0) {
        temp = add(in1, [1, 0]);
    }

    var q[2][2] = div(in1, add(in2, temp));
    signal output out[2] <-- q[0];
    signal remainder[2] <-- q[1];

    signal inter[2] <== Mul()(out, in2);
    signal res[2] <== Add()(inter, remainder);
    signal eq[2] <== Eq()(res, in1);
    eq[0] === 1;

    //Assume divisor is not 0
    //Ensure 0 <= remainder < in2
    signal lt_r[2] <== LEqT()([0,0],remainder);
    signal lt_divisor[2] <== LT()(remainder, in2);

    lt_r[0]*lt_divisor[0] === 1;

    // // Ensure out is zero if in2 is zero
    // signal is_zero_out[2] <== IsZero256()(in2);
    // is_zero_out[0] * out[0] === 0;
    // is_zero_out[0] * out[1] === 0;
}