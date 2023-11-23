pragma circom 2.1.6;
include "../node_modules/circomlib/circuits/comparators.circom";

template Div () {
    signal input in[2];
    signal r;
    signal inter;
    signal output out;

    var temp;
    temp = 0;

    if (in[1] == 0) {
        temp = in[0] + 1;
    } 

    r <-- in[0] % (in[1] + temp);
    out <-- (in[0] - r) / (in[1] + temp);

    inter <== out * in[1]; // -out * in[1] = -in[0] + inter
    inter + r === in[0];

    // Ensure out is zero if in[1] is zero
    component isZero = IsZero();
    isZero.in <== in[1];
    isZero.out * out === 0;
}