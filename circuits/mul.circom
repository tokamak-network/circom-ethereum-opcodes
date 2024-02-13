pragma circom 2.1.6;
include "templates/128bit/divider.circom";

//256bits(a*2^128+b) x 256bits(c*2^128+d)
template Mul () {
    signal input in1[2], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
    signal c[4],d[4];

    component split_in1_lower = Divider(64);
    component split_in1_upper = Divider(64);

    split_in1_lower.in <== in1[0];
    split_in1_upper.in <== in1[1];
    c[0] <== split_in1_lower.r;
    c[1] <== split_in1_lower.q;
    c[2] <== split_in1_upper.r;
    c[3] <== split_in1_upper.q;

    component split_in2_lower = Divider(64);
    component split_in2_upper = Divider(64);

    split_in2_lower.in <== in2[0];
    split_in2_upper.in <== in2[1];
    d[0] <== split_in2_lower.r;
    d[1] <== split_in2_lower.q;
    d[2] <== split_in2_upper.r;
    d[3] <== split_in2_upper.q;

    signal inter[8];

    inter[0] <== c[3]*d[0];
    inter[1] <== inter[0] + c[2]*d[1];
    inter[2] <== inter[1] + c[1]*d[2];
    signal bits_256 <== inter[2] + c[0]*d[3];

    inter[3] <== c[2]*d[0];
    inter[4] <== inter[3] + c[1]*d[1];
    signal bits_192 <== inter[4] + c[0]*d[2];

    inter[7] <== c[1]*d[0];
    signal bits_128 <== inter[7] + c[0]*d[1];
    signal bits_64 <== c[0]*d[0];

    signal e[2];
    e[0] <== (bits_128)*(2**64) + bits_64;
    e[1] <== (bits_256)*(2**64) + bits_192;

    component out_lower = Divider(128);
    out_lower.in <== e[0];

    component out_upper = Divider(128);
    out_upper.in <== e[1] + out_lower.q;

    signal output out[2] <== [
        out_lower.r,
        out_upper.r
    ]; // 256-bit integer consisting of two 128-bit integers; out[0]: lower, out[1]: upper
}