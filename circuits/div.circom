pragma circom 2.1.6;
include "add.circom";
include "mul.circom";
include "eq.circom";
include "lt.circom";
include "iszero.circom";
include "templates/arithmetic_func.circom";

template Div () {
    signal input in1[2], in2[2];

    signal is_zero_out[2] <== IsZero256()(in2);

    var q[2][2] = div(in1, in2); //div 
    signal output out[2] <-- q[0];
    signal remainder[2] <-- q[1];

    signal inter[2] <== Mul()(out, in2);
    signal res[2] <== Add()(inter, remainder);
    signal eq[2] <== Eq()(res, in1);
    eq[0] === 1;

    //rc => Range Check
    signal rc_divisor[2];
    rc_divisor[0] <== in2[0] + is_zero_out[0];
    rc_divisor[1] <== in2[1] + is_zero_out[0];

    signal rc_remainder[2];
    rc_remainder[0] <== (1 - is_zero_out[0])*remainder[0];
    rc_remainder[1] <== (1 - is_zero_out[0])*remainder[1];

    //@todo: if divisor == 0 { out = 0 }
    //Ensure 0 <= rc_remainder < rc_divisor
    signal lt_r[2] <== LEqT()([0,0],rc_remainder);
    signal lt_divisor[2] <== LT()(rc_remainder, rc_divisor);

    lt_r[0]*lt_divisor[0] === 1;

    // Ensure out is zero if in2 is zero
    is_zero_out[0] * out[0] === 0;
    is_zero_out[0] * out[1] === 0;
}