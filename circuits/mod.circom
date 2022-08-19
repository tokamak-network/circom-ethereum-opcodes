pragma circom 2.0.5;

// TODO: 0 if in[1] == 0
template Mod () {
    signal input in[2];
    signal q;
    signal output out;

    assert(in[1] != 0);

    out <-- in[0] % in[1];
    q <-- (in[0] - out) / in[1];

    q * in[1] === in[0] - out;
}