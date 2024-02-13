pragma circom 2.1.6;
include "divider.circom";

template Adder128 () {
    signal input in[2], carry_in;
    var NUM_BITS = 128;

    component divider = Divider(NUM_BITS);
    divider.in <== in[0] + in[1] + carry_in;

    signal output carry_out <== divider.q;
    signal output sum <== divider.r;
}