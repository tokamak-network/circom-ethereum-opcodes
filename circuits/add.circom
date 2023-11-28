pragma circom 2.1.6;
include "templates/128bit/add.circom";

template Add () {
    signal input in1[2], in2[2];

    component adder_lower = Adder128();
    component adder_upper = Adder128();

    adder_lower.in[0] <== in1[0];
    adder_lower.in[1] <== in2[0];
    adder_lower.carry_in <== 0;

    adder_upper.in[0] <== in1[1];
    adder_upper.in[1] <== in2[1];
    adder_upper.carry_in <== adder_lower.carry_out;

    signal output out[2];
    out[0] <== adder_lower.sum;
    out[1] <== adder_upper.sum;
}