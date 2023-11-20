pragma circom 2.0.5;
include "../div.circom";
include "../mod.circom";
include "alu.circom"; // arithmetic logic unit
include "mlu.circom"; // mixed logic unit
include "selector_integrity_check.circom"; // selector integrity check

template IC () {
  signal input in[3], selector;
  signal output out;
  signal alu_selector, mlu_selector;

  var NUM_BITS = 253;
  var NUM_ALU_FUNCTIONS = 15; // number of functions in the ALU
  var NUM_MLU_FUNCTIONS = 8;  // number of functions in the MLU that requires one bitification
  var NUM_FUNCTIONS = NUM_ALU_FUNCTIONS + NUM_MLU_FUNCTIONS;

  // selector bitification
  component b_selector = Num2Bits(NUM_FUNCTIONS);
  b_selector.in <== selector;

  // selector integrity check
  component selector_integrity_check = SelectorIntegrityCheck(NUM_FUNCTIONS);
  for (var i = 0; i < NUM_FUNCTIONS; i++) {
    selector_integrity_check.in[i] <== b_selector.out[i];
  }

  // initialize ALU
  component alu = ALU();
  alu.in[0] <== in[0];
  alu.in[1] <== in[1];
  alu.in[2] <== in[2];
  for (var i = 0; i < NUM_ALU_FUNCTIONS; i++) {
    alu.b_selector[i] <== b_selector.out[i];
  }

  // initialize MLU
  component mlu = MLU(NUM_BITS);
  mlu.in[0] <== in[0];
  mlu.in[1] <== in[1];
  for (var i = 0; i < NUM_MLU_FUNCTIONS; i++) {
    mlu.b_selector[i] <== b_selector.out[i + NUM_ALU_FUNCTIONS];
  }

  out <== alu.out + mlu.out;
}