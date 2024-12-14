pragma circom 2.1.6;

template Buffer () {
    var N = 256;
    signal input in[N];
    signal output out[N] <== in;
}