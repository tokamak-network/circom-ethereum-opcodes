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

    signal inter[6];

    inter[0] <== c[3]*d[0];
    inter[1] <== inter[0] + c[2]*d[1];
    inter[2] <== inter[1] + c[1]*d[2];
    signal bits_256 <== inter[2] + c[0]*d[3];

    inter[3] <== c[2]*d[0];
    inter[4] <== inter[3] + c[1]*d[1];
    signal bits_192 <== inter[4] + c[0]*d[2];

    inter[5] <== c[1]*d[0];
    signal bits_128 <== inter[5] + c[0]*d[1];
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

template CarryMul () {
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

    signal inter[6];

    inter[0] <== c[3]*d[0];
    inter[1] <== inter[0] + c[2]*d[1];
    inter[2] <== inter[1] + c[1]*d[2];
    signal bits_256 <== inter[2] + c[0]*d[3];

    inter[3] <== c[2]*d[0];
    inter[4] <== inter[3] + c[1]*d[1];
    signal bits_192 <== inter[4] + c[0]*d[2];

    inter[5] <== c[1]*d[0];
    signal bits_128 <== inter[5] + c[0]*d[1];
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
        out_upper.r + out_upper.q * 2**128
    ];
}

template BigMul256() {
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

    signal inter[9];

    signal bits_512 <== c[3]*d[3];
    inter[0] <== c[3]*d[2];
    signal bits_384 <== inter[0] + c[2]*d[3];
    inter[1] <== c[3]*d[1];
    inter[2] <== c[2]*d[2];
    signal bits_320 <== inter[1] + inter[2] + c[1]*d[3];

    inter[3] <== c[3]*d[0];
    inter[4] <== inter[3] + c[2]*d[1];
    inter[5] <== inter[4] + c[1]*d[2];
    signal bits_256 <== inter[5] + c[0]*d[3];

    inter[6] <== c[2]*d[0];
    inter[7] <== inter[6] + c[1]*d[1];
    signal bits_192 <== inter[7] + c[0]*d[2];

    inter[8] <== c[1]*d[0];
    signal bits_128 <== inter[8] + c[0]*d[1];
    signal bits_64 <== c[0]*d[0];

    signal e[4];
    e[0] <== (bits_128)*(2**64) + bits_64;
    e[1] <== (bits_256)*(2**64) + bits_192;
    e[2] <== (bits_384)*(2**64) + bits_320;
    e[3] <== bits_512;

    component out_lower = Divider(128);
    out_lower.in <== e[0];

    component out_upper = Divider(128);
    out_upper.in <== e[1] + out_lower.q;

    component out_upper256 = Divider(128);
    out_upper256.in <== e[2] + out_upper.q;

    signal output out[4] <== [
        out_lower.r,
        out_upper.r,
        out_upper256.r,
        e[3] + out_upper256.q
    ];
}

template BigMul512() {
    signal input in1[4], in2[2]; // 256-bit integers consisting of two 128-bit integers; in[0]: lower, in[1]: upper
    signal c[8],d[4];


    component split_in1_lower[2];
    component split_in1_upper[2];

    split_in1_lower[0] = Divider(64);
    split_in1_upper[0] = Divider(64);
    
    split_in1_lower[0].in <== in1[0];
    split_in1_upper[0].in <== in1[1];
    c[0] <== split_in1_lower[0].r;
    c[1] <== split_in1_lower[0].q;
    c[2] <== split_in1_upper[0].r;
    c[3] <== split_in1_upper[0].q;

    split_in1_lower[1] = Divider(64);
    split_in1_upper[1] = Divider(64);

    split_in1_lower[1].in <== in1[2];
    split_in1_upper[1].in <== in1[3];
    c[4] <== split_in1_lower[1].r;
    c[5] <== split_in1_lower[1].q;
    c[6] <== split_in1_upper[1].r;
    c[7] <== split_in1_upper[1].q;

    component split_in2_lower = Divider(64);
    component split_in2_upper = Divider(64);

    split_in2_lower.in <== in2[0];
    split_in2_upper.in <== in2[1];
    d[0] <== split_in2_lower.r;
    d[1] <== split_in2_lower.q;
    d[2] <== split_in2_upper.r;
    d[3] <== split_in2_upper.q;

    //This Circuit is for special cases. Output should be 512bit.
    d[3]*(c[7]+c[6]+c[5]) === 0;
    d[2]*(c[7]+c[6]) === 0;
    d[1]*c[7] === 0;

    signal inter[20];
    var i;

    for(i=0; i < 4; i++){
        inter[i] <== c[i+4]*d[3-i];
        inter[i+4] <== c[i+3]*d[3-i];
        inter[i+8] <== c[i+2]*d[3-i];
        inter[i+12] <== c[i+1]*d[3-i];
        inter[i+16] <== c[i]*d[3-i];
    }
    signal bits_512 <== inter[0] + inter[1] + inter[2] + inter[3];
    signal bits_448 <== inter[4] + inter[5] + inter[6] + inter[7];
    signal bits_384 <== inter[8] + inter[9] + inter[10] + inter[11];
    signal bits_320 <== inter[12] + inter[13] + inter[14] + inter[15];
    signal bits_256 <== inter[16] + inter[17] + inter[18] + inter[19];

    signal res[3];

    res[0] <== c[0]*d[2];
    res[1] <== res[0] + c[1]*d[1];
    signal bits_192 <== res[1] + c[2]*d[0];
    
    res[2] <== c[1]*d[0];
    signal bits_128 <== res[2] + c[0]*d[1];
    signal bits_64 <== c[0]*d[0];

    signal e[4];
    e[0] <== (bits_128)*(2**64) + bits_64;
    e[1] <== (bits_256)*(2**64) + bits_192;
    e[2] <== (bits_384)*(2**64) + bits_320;
    e[3] <== (bits_512)*(2**64) + bits_448;

    component out_lower = Divider(128);
    out_lower.in <== e[0];

    component out_upper = Divider(128);
    out_upper.in <== e[1] + out_lower.q;

    component out_upper256 = Divider(128);
    out_upper256.in <== e[2] + out_upper.q;

    signal output out[4] <== [
        out_lower.r,
        out_upper.r,
        out_upper256.r,
        e[3] + out_upper256.q
    ];
}