pragma circom 2.1.6;
include "../../circuits/integrated_circuits/mlu.circom";

component main {public [in, b_selector]} = MLU(253);