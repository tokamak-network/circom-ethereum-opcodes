pragma circom 2.1.6;
include "divider.circom";

template Adder128 () {
    signal input in[2], carry_in;
    var NUM_BITS = 128;
    
    component divider = Divider128();
    divider.in[0] <== in[0] + in[1] + carry_in;
    divider.in[1] <== 2**NUM_BITS;

    signal output carry_out <== divider.q;
    signal output sum <== divider.r;
}