pragma circom 2.1.6;
include "div_and_mod.circom";

template Adder128 () {
    signal input in[2], carry_in;
    var NUM_BITS = 128;
    
    component div_and_mod = DivAndMod();
    div_and_mod.in[0] <== in[0] + in[1] + carry_in;
    div_and_mod.in[1] <== 2**NUM_BITS;

    signal output carry_out <== div_and_mod.q;
    carry_out * (1 - carry_out) === 0;

    signal output sum <== div_and_mod.r;
}