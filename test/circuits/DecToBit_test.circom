pragma circom 2.1.6;
include "../../node_modules/circomlib/circuits/bitify.circom";

component main {public [in]} = Num2Bits(256);