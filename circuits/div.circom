pragma circom 2.0.5;

template Div () {
    signal input in[2];
    signal r;
    signal output out;

    r <-- in[0] % in[1];
    out <-- (in[0] - r) / in[1];

    out * in[1] === in[0] - r;
}