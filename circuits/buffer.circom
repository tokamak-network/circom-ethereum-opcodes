pragma circom 2.1.6;

template Buffer () {
    signal input in[32];
    signal output out[32] <== in;
}