pragma circom 2.1.6;
include "mul.circom";
include "sub.circom";
include "div.circom";
include "iszero.circom";

template Mod () {
    signal input in1[2], in2[2];

    signal is_zero_out[2] <== IsZero256()(in2);

    var q[2][2] = div(in1, in2);
    signal quotient[2] <-- q[0];
    signal remainder[2] <-- q[1];

    signal inter[2] <== Mul()(quotient, in2);
    signal res[2] <== Add()(inter, remainder);
    signal eq[2] <== Eq()(res, in1);
    eq[0] === 1;

    //rc => Range Check
    signal rc_divisor[2];
    rc_divisor[0] <== in2[0] + is_zero_out[0];
    rc_divisor[1] <== in2[1] + is_zero_out[0];

    signal output out[2];
    out[0] <== (1 - is_zero_out[0])*remainder[0];
    out[1] <== (1 - is_zero_out[0])*remainder[1];

    //Ensure 0 <= out < rc_divisor
    signal lt_r[2] <== LEqT()([0,0],out);
    signal lt_divisor[2] <== LT()(out, rc_divisor);

    lt_r[0]*lt_divisor[0] === 1;

    // Ensure quotient is zero if in2 is zero
    is_zero_out[0] * quotient[0] === 0;
    is_zero_out[0] * quotient[1] === 0;
}