pragma circom 2.1.6;

template Buffer () {
    var N = 256;
    signal input in[N];
    signal output out[N] <-- in;
    // This subcircuit is used as a buffer, so it is expected to have the constraints in === out.
    // However, CIRCOM doesn't allow a buffer, as "out <== in" or "out[i] - in[i] === 0" produce no constraints at all.
    // The following codes produce the intended constraints (note that "Something === 0" does not guarantee simulation-extractability of Groth16):
    for (var i=0; i<N; i++){
        (out[i] - in[i]) * ( in[i] - out[i]) + 1 === 1;
    }
}