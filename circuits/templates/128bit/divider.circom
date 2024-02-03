pragma circom 2.1.6;
include "../../../node_modules/circomlib/circuits/comparators.circom";

template Divider128 () {
    signal input in[2];

    var temp = 0;
    if (in[1] == 0) {
        temp = in[0] + 1;
    }

    signal output r <-- in[0] % (in[1] + temp);
    signal output q <-- in[0] \ (in[1] + temp); //integer division

    in[0] === q * in[1] + r;

    // Ensure out is zero if in[1] is zero
    signal is_zero_out <== IsZero()(in[1]);
    is_zero_out * q === 0;

    //Ensure 0 <= r < in[1]+temp;
    component lt_r = LessEqThan(128);
    lt_r.in[0] <== 0;
    lt_r.in[1] <== r;

    component lt_in1 = LessThan(128);
    lt_in1.in[0] <== r;
    lt_in1.in[1] <== in[1]; //todo: (in[1] + temp);

    lt_r.out * lt_in1.out === 1;
}

