pragma circom 2.0.5;

template Mul () {
    signal input in[2];
    signal output out;

    out <== in[0] * in[1];
}