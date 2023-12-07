pragma circom 2.1.6;
include "128bit/exp.circom";
include "comparators.circom";

template CalculateTwoToThePowerOfN () {
    signal input n; // assume n < 2**128
    assert(n < 2**128);

    // determine the range of n
    signal is_less_than_128 <== IsLessThanN()([0, n], 128);
    signal is_less_than_256 <== IsLessThanN()([0, n], 256)

    // if n < 128
    signal inter1 <== Exp128()([2, n]);

    // if 128 <= n < 256
    signal inter2 <== Exp128()([2, n - 128]);

    // select the correct result    
    signal temp <== is_less_than_256 * inter2;
    signal output out[2] <== [
        is_less_than_128 * inter1,
        (1 - is_less_than_128) * temp
    ];
}