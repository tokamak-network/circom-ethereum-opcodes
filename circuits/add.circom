pragma circom 2.1.6;
include "templates/128bit/adder.circom";

template Add () {
    signal input in1[2], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper

    component adder_lower = Adder128();
    adder_lower.in <== [in1[0], in2[0]];
    adder_lower.carry_in <== 0;

    component adder_upper = Adder128();
    adder_upper.in <== [in1[1], in2[1]];
    adder_upper.carry_in <== adder_lower.carry_out;

    signal output out[2] <== [
        adder_lower.sum,
        adder_upper.sum
    ];
}

template BigAdd() {
    signal input in1[2], in2[2];

    component adder_lower = Adder128();
    adder_lower.in <== [in1[0],in2[0]];
    adder_lower.carry_in <== 0;

    component adder_upper = Adder128();
    adder_upper.in <== [in1[1], in2[1]];
    adder_upper.carry_in <== adder_lower.carry_out;

    signal output out[2] <== [
        adder_lower.sum,
        adder_upper.sum + adder_upper.carry_out * 2**128
    ];
}

template CarryAdd() {
    signal input in1[2], in2[2];

    component adder_lower = Adder128();
    adder_lower.in <== [in1[0],in2[0]];
    adder_lower.carry_in <== 0;

    component adder_upper = Adder128();
    adder_upper.in <== [in1[1], in2[1]];
    adder_upper.carry_in <== adder_lower.carry_out;

    signal output out[2] <== [
        adder_lower.sum,
        adder_upper.sum
    ];
    signal output carry_out <== adder_upper.carry_out;
}

template BigAdd512() {
    signal input in1[4], in2[4];

    component adder_lower = Adder128();
    adder_lower.in <== [in1[0],in2[0]];
    adder_lower.carry_in <== 0;

    component adder_upper = Adder128();
    adder_upper.in <== [in1[1], in2[1]];
    adder_upper.carry_in <== adder_lower.carry_out;

    component adder_lower256 = Adder128();
    adder_lower256.in <== [in1[2],in2[2]];
    adder_lower256.carry_in <== adder_upper.carry_out;

    component adder_upper256 = Adder128();
    adder_upper256.in <== [in1[3], in2[3]];
    adder_upper256.carry_in <== adder_lower256.carry_out;

    signal output out[4] <== [
        adder_lower.sum,
        adder_upper.sum,
        adder_lower256.sum,
        adder_upper256.sum + adder_upper256.carry_out * 2**128
    ];
}