pragma circom 2.1.6;

template Load () {
    signal input in[32];
    signal output out[32] <== in;
}