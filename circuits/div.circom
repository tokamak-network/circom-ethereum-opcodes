pragma circom 2.1.6;
include "add.circom";
include "mul.circom";
include "eq.circom";
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

    // Ensure out is zero if in[1] is zero
    signal is_zero_out[2] <== IsZero256()(in2);
    signal res2[2] <== Mul()(is_zero_out, out);
    res2[0] === 0;
    res2[1] === 0;
}