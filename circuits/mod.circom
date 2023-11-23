pragma circom 2.1.6;
include "div.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template Mod () {
    signal input in[2];
    signal q;
    signal inter;
    signal output out;

    component div = Div();
    div.in[0] <== in[0];
    div.in[1] <== in[1];

    component isZero = IsZero();
    isZero.in <== in[1];
    
    inter <== div.out * in[1];
    out <== (1 - isZero.out) * (in[0] - inter);
}