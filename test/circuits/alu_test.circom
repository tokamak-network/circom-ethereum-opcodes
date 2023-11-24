pragma circom 2.1.6;
include "../../circuits/integrated_circuits/alu.circom";

component main {public [in, b_selector]} = ALU();