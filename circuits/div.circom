pragma circom 2.0.5;

// TODO: 0 if in[1] == 0
template Div () {
    signal input in[2];
    signal r;
    signal output out;

    assert(in[1] != 0);

    r <-- in[0] % in[1];
    out <-- (in[0] - r) / in[1];

    out * in[1] === in[0] - r;
}