pragma circom 2.1.6;
include "../../../node_modules/circomlib/circuits/bitify.circom";
include "../../../node_modules/circomlib/circuits/comparators.circom";
include "divider.circom";

template Exp128 () {
    signal input in[2];
    signal output out;

    var NUM_EXP_BITS = 7; // 0 <= exp < 2**7 = 128
    var NUM_BITS = 2**NUM_EXP_BITS;
    component mod1 = Divider128();
    mod1.in[0] <== in[1];
    mod1.in[1] <== NUM_BITS;

    signal exp[NUM_EXP_BITS];
    signal inter[NUM_EXP_BITS];
    signal temp[NUM_EXP_BITS]; // Used to detour a non-quadratic constraint error.

    component num_to_bits = Num2Bits(NUM_EXP_BITS);
    num_to_bits.in <== mod1.r;

    exp[0] <== in[0];
    inter[0] <== 1;
    
    component mod2 = Divider128();

    for (var i = 0; i < NUM_EXP_BITS; i++) {
        temp[i] <== num_to_bits.out[i] * exp[i] + (1 - num_to_bits.out[i]); // exponent_bin[i] == 1 ? 2^(i+1) : 1
        if (i < NUM_EXP_BITS - 1) {
            inter[i + 1] <== inter[i] * temp[i];
            exp[i + 1] <== exp[i] * exp[i];
        } else {
            mod2.in[0] <== inter[i] * temp[i];
            mod2.in[1] <== 2**NUM_BITS;
            out <== mod2.r;
        }
    }
}

template BinaryExp128 () {
    signal input in;
    signal output out;

    var NUM_EXP_BITS = 7;
    var NUM_BITS = 2**NUM_EXP_BITS;

    signal is_zero_out <== IsZero()(NUM_BITS - in);

    signal exp[NUM_EXP_BITS];
    signal inter[NUM_EXP_BITS];
    signal temp[NUM_EXP_BITS]; // Used to detour a non-quadratic constraint error.

    component n2b = Num2Bits(NUM_EXP_BITS);
    n2b.in <== (1 - is_zero_out) * in;

    exp[0] <== 2;
    inter[0] <== 1;

    for (var i = 0; i < NUM_EXP_BITS; i++){
        temp[i] <== n2b.out[i] * exp[i] + (1 - n2b.out[i]);
        if(i < NUM_EXP_BITS - 1) {
            inter[i+1] <== inter[i] * temp[i];
            exp[i+1] <== exp[i] * exp[i];
        } else {
            out <== inter[i] * temp[i];
        }
    }

}

template BinaryModExp128 () {
    signal input in;
    signal output out;

    var NUM_EXP_BITS = 7;

    component mod = Divider(NUM_EXP_BITS);
    mod.in <== in;

    signal exp[NUM_EXP_BITS];
    signal inter[NUM_EXP_BITS];
    signal temp[NUM_EXP_BITS]; // Used to detour a non-quadratic constraint error.

    component n2b = Num2Bits(NUM_EXP_BITS);
    n2b.in <== mod.r;

    exp[0] <== 2;
    inter[0] <== 1;

    for (var i = 0; i < NUM_EXP_BITS; i++){
        temp[i] <== n2b.out[i] * exp[i] + (1 - n2b.out[i]);
        if(i < NUM_EXP_BITS - 1) {
            inter[i+1] <== inter[i] * temp[i];
            exp[i+1] <== exp[i] * exp[i];
        } else {
            out <== inter[i] * temp[i];
        }
    }

}