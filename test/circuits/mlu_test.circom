pragma circom 2.0.5;
include "../../circuits/integrated_circuits/mlu.circom";

component main {public [in, b_selector]} = MLU(253);