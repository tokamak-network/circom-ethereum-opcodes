pragma circom 2.1.6;
include "templates/comparators.circom";
template Buffer () {
    var N = 256;
    signal input in[N];
    // This subcircuit is used as a buffer, so it is expected to have the constraints in === out.
    // However, CIRCOM doesn't allow a buffer, as "out <== in" or "out[i] - in[i] === 0" produce no constraints at all.
    // The following codes produce the intended constraints:
    signal output out[N] <-- in;
    signal inter[N];
    for (var i=0; i<N; i++){
        inter[i] <== IsEqual()([in[i], out[i]]);
        inter[i] === 1;
    }
    // Todo: This code relies on "Something === 0", which can result in zero columns and break simulation-extractability of Groth16.

    // WITH THE FOLLOWING SIMPLE LINE YOU MUST USE CIRCOM OPTION FLAG -O0 TO GET PROPER CONSTRAINTS (STILL THE RESULING CONSTRAINTS ARE NOT ROBUST TO PROOF FORGING)
    // signal output out[N] <== in;
}