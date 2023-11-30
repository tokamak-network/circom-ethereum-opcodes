pragma circom 2.1.6;
include "add.circom";

template Sub () {
    signal input in1[2], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper

    component twos_complement = Add();
    twos_complement.in1 <== [2**128 - 1 - in2[0], 2**128 - 1 - in2[1]];
    twos_complement.in2 <== [1, 0];

    signal output out[2] <== Add()(in1, twos_complement.out);
}