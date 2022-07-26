pragma circom 2.0.5;

template Sub () {
    signal input in[2];
    signal output out;

    out <== in[0] - in[1];
}
// component main {public [in]} = Sub();