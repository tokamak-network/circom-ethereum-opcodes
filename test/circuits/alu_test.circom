pragma circom 2.0.5;
include "../../circuits/integrated_circuits/alu.circom";

component main {public [in, b_selector]} = ALU();