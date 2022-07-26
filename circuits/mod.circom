pragma circom 2.0.5;

template Mod () {
    signal input in[2];
    signal q;
    signal output out;

    out <-- in[0] % in[1];
    q <-- (in[0] - out) / in[1];

    q * in[1] === in[0] - out;
}