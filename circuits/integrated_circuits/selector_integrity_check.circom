pragma circom 2.1.6;
template SelectorIntegrityCheck (NUM_FUNCTIONS) {
  signal input in[NUM_FUNCTIONS];

  var sum = 0; // sum of the selector bits

  for (var i = 0; i < NUM_FUNCTIONS; i++) { // loop through the output array and compute the sum
    sum += in[i];
  }

  sum === 1; // add a constraint to enforce the sum equals 1

}