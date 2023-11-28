pragma circom 2.1.6;
include "../../../node_modules/circomlib/circuits/comparators.circom";

template DivAndMod () {
    signal input in[2];

    var temp = 0;
    if (in[1] == 0) {
        temp = in[0] + 1;
    } 

    signal output r <-- in[0] % (in[1] + temp);
    signal output q <-- (in[0] - r) / (in[1] + temp);

    signal inter <== q * in[1]; // -q * in[1] = -in[0] + inter
    inter + r === in[0];

    // Ensure out is zero if in[1] is zero
    signal is_zero_out <== IsZero()(in[1]);
    is_zero_out * q === 0;
}