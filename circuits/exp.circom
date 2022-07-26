pragma circom 2.0.5;
include "../node_modules/circomlib/circuits/bitify.circom";

template Exp () {
    signal input in;
    signal input n;
    signal output out;

    assert(n <= 253); // 2^253 already overflows 253-bit unsigned integer; the possible maximum exponenet value is 252 
                      // Since 2**253 can be described inside the circom integer range(the circom prime number is larger than 2**253), we set 253 as maximum value for other usages(SAR, etc).

    var num_bits = 8; // An exponent can be represented into 8 bits since it is 252 at max. 

    signal exp[num_bits];
    signal inter[num_bits];
    signal temp[num_bits]; // Used to detour a non-quadratic constraint error.

    component num2Bits = Num2Bits(num_bits);
    num2Bits.in <== n;

    exp[0] <== in;
    inter[0] <== 1;
    for (var i = 0; i < num_bits; i++) {
        temp[i] <== num2Bits.out[i] * exp[i] + (1 - num2Bits.out[i]); // exponent_bin[i] == 1 ? 2^(i+1) : 1
        if (i < num_bits - 1) {
            inter[i + 1] <== inter[i] * temp[i];
            exp[i + 1] <== exp[i] * exp[i];
        } else {
            out <== inter[i] * temp[i];
        }
    }
}
// component main {public [in, n]} = Exp();