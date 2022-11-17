pragma circom 2.0.5;

template Div () {
    signal input in[2];
    signal r;
    signal output out;

    var temp;
    temp = 0;

    if (in[1] == 0) {
        temp = in[0] + 1;
    }

    r <-- in[0] % (in[1] + temp);
    out <-- (in[0] - r) / (in[1] + temp);

    // FIXME: in[1] == 0 -> out * 0 === in[0] - in[0] -> does not ensure out must be zero
    out * in[1] === in[0] - r;
}