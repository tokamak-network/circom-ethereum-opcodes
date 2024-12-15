pragma circom 2.1.6;
include "add.circom";
include "mul.circom";
include "templates/128bit/divider.circom";
include "../node_modules/circomlib/circuits/bitify.circom";
//deprecated
template Exp () {
    signal input in1[2], in2[2];
    signal output out[2];

    var NUM_BITS = 256;
    var NUM_EXP_BITS = 8; // an exponent can be represented into 8 bits since it is 255 at max

    component divider = Divider128(); // ensure the exponent is always less 256
    divider.in <== [in2[0], NUM_BITS];

    component num2Bits = Num2Bits(NUM_EXP_BITS);
    num2Bits.in <== divider.r;

    signal exp[NUM_EXP_BITS][2];
    signal inter[NUM_EXP_BITS][2];
    signal temp[NUM_EXP_BITS][2]; // used to detour a non-quadratic constraint error


    exp[0] <== in1;
    inter[0] <== [1, 0];

    for (var i = 0; i < NUM_EXP_BITS; i++) {
        temp[i] <== [
            num2Bits.out[i] * exp[i][0] + (1 - num2Bits.out[i]), 
            num2Bits.out[i] * exp[i][1]
        ]; // exponent_bin[i] == 1 ? n^(i+1) : 1

        if (i < NUM_EXP_BITS - 1) {
            inter[i + 1] <== Mul()(inter[i], temp[i]);
            exp[i + 1] <== Mul()(exp[i], exp[i]);
        } else {
            out <== Mul()(inter[i], temp[i]);
        }
    }
}