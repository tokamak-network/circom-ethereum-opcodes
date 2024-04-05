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
    //signal lt_r[2] <== LEqT()([0,0],out);
    signal lt_divisor[2] <== LT()(out, rc_divisor);

    lt_divisor[0] === 1;

    // Ensure quotient is zero if in2 is zero
    is_zero_out[0] * quotient[0] === 0;
    is_zero_out[0] * quotient[1] === 0;
}

template CarryMod () {
    signal input in1[2], in2[2];

    signal is_zero_out[2] <== IsZero256()(in2);

    var q[2][2] = div(in1, in2);
    signal quotient[2] <-- q[0];
    signal remainder[2] <-- q[1];

    signal inter[4] <== BigMul256()(quotient, in2);
    inter[3] === 0;
    inter[2]*(1-inter[2]) === 0;

    signal res[2] <== BigAdd()([inter[0], inter[1] + (inter[2] * 2**128)], remainder);
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
    //signal lt_r[2] <== LEqT()([0,0],out);
    signal lt_divisor[2] <== LT()(out, rc_divisor);

    lt_divisor[0] === 1;

    // Ensure quotient is zero if in2 is zero
    is_zero_out[0] * quotient[0] === 0;
    is_zero_out[0] * quotient[1] === 0;
}

template BigMod () {
    signal input in1[4], in2[2];

    signal is_zero_out[2] <== IsZero256()(in2);

    var q[2][4] = div512(in1, in2);
    signal quotient[4] <-- q[0];
    signal remainder[4] <-- q[1];

    signal inter[4] <== BigMul512()(quotient, in2);
    signal sum[4] <== BigAdd512()(inter, remainder);

    in1[0] === sum[0];
    in1[1] === sum[1];
    in1[2] === sum[2];
    in1[3] === sum[3];

    //rc => Range Check
    signal rc_divisor[2];
    rc_divisor[0] <== in2[0] + is_zero_out[0];
    rc_divisor[1] <== in2[1] + is_zero_out[0];

    (1-is_zero_out[0])*(remainder[2]+remainder[3]) === 0;

    signal output out[2];
    out[0] <== (1 - is_zero_out[0])*remainder[0];
    out[1] <== (1 - is_zero_out[0])*remainder[1];

    //Ensure 0 <= out < rc_divisor
    //signal lt_r[2] <== LEqT()([0,0],out);
    signal lt_divisor[2] <== LT()(out, rc_divisor);

    lt_divisor[0] === 1;

    // Ensure quotient is zero if in2 is zero
    is_zero_out[0] * quotient[0] === 0;
    is_zero_out[0] * quotient[1] === 0;
    is_zero_out[0] * quotient[2] === 0;
    is_zero_out[0] * quotient[3] === 0;
}