pragma circom 2.1.6;
include "../../../node_modules/circomlib/circuits/comparators.circom";

//in[0] = q * in[1] + r
//Not used when divisor is zero
template Divider128 () {
    signal input in[2];

    assert(in[1] != 0);

    signal output r <-- in[0] % in[1];
    signal output q <-- in[0] \ in[1]; //integer division

    in[0] === q * in[1] + r;

    // Ensure out is zero if in[1] is zero
    signal is_zero_out <== IsZero()(in[1]);
    is_zero_out * q === 0;

    //Ensure 0 <= r < in[1];
    // component lt_r = LessEqThan(128);
    // lt_r.in[0] <== 0;
    // lt_r.in[1] <== r;

    component lt_in1 = LessThan(128);
    lt_in1.in[0] <== r;
    lt_in1.in[1] <== in[1];

    lt_in1.out === 1;
}

template Divider (n) {
    //add assert
    signal input in;

    var divisor = 2**n;

    signal output r <-- in % divisor;
    signal output q <-- in \ divisor;

    in === q * divisor + r;

    // Ensure 0 <= r < divisor;
    // component lt_r = LessEqThan(n);
    // lt_r.in[0] <== 0;
    // lt_r.in[1] <== r;

    component lt_divisor = LessThan(n);
    lt_divisor.in[0] <== r;
    lt_divisor.in[1] <== divisor;

    lt_divisor.out === 1;
}