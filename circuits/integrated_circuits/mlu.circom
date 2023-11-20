pragma circom 2.0.5;
include "../../node_modules/circomlib/circuits/bitify.circom";

include "mixed_logic_unit/signextend.circom";
include "mixed_logic_unit/byte.circom";
include "mixed_logic_unit/sar.circom";
include "mixed_logic_unit/not.circom";
include "mixed_logic_unit/slt.circom";


// this function returns the value fed to bitify circuit for the given input values to the lt function
function convertLTInputsBitifyInput (in0, in1, n) {
  return in0 + (1<<n) - in1;
}

template MLU (NUM_BITS) {
  var NUM_FUNCTIONS = 8;
  signal input in[2], b_selector[NUM_FUNCTIONS];
  signal output out;
  signal inter_input[NUM_FUNCTIONS - 1];
  signal inter_output[NUM_FUNCTIONS - 1];

  // input selection
  // filters out the inputs that are not needed to be converted to bits so that we can avoid unnecessary bitification
  // for example, if the selector is 0x01, then it performs the bitification logic inside the signextend circuit.

  // 0x0b: signextend lt(in[0], 30)
  inter_input[0] <== convertLTInputsBitifyInput(in[0], 30, NUM_BITS - 1) * b_selector[0];

  // 0x10: lt lt(in[0], in[1])
  inter_input[1] <== inter_input[0] + convertLTInputsBitifyInput(in[0], in[1], NUM_BITS - 1) * b_selector[1];

  // 0x11: gt lt(in[1], in[0])
  inter_input[2] <== inter_input[1] + convertLTInputsBitifyInput(in[1], in[0], NUM_BITS - 1) * b_selector[2];
  
  //  0x12: slt lt(in[0], in[1])
  inter_input[3] <== inter_input[2] + convertLTInputsBitifyInput(in[0], in[1], NUM_BITS - 1) * b_selector[3];

  // 0x13: sgt lt(in[0], in[1])
  inter_input[4] <== inter_input[3] + convertLTInputsBitifyInput(in[1], in[0], NUM_BITS - 1) * b_selector[4];

  //  0x19: not n2b <-- in[0]
  inter_input[5] <== inter_input[4] + in[0] * b_selector[5];

  // 0x1a: byte lt(in[0], 32)
  inter_input[6] <== inter_input[5] + convertLTInputsBitifyInput(in[0], 32, NUM_BITS - 1) * b_selector[6];

  // 0x1d: sar  n2b <-- in[1]
  // FYI: the sar input is directly fed to the following Num2Bits to save a signal

  // bitification
  component num2Bits = Num2Bits(NUM_BITS);
  num2Bits.in <== inter_input[6] + in[1] * b_selector[7]; // selected input value including sar

  // perform the subcircuit logics
  // this executes all the subcircuits and will return the output of the subcircuit that is selected by the selector
  // therefore it does not matter if the rest of subcircuits are executed with incorrect input values
  
  // 0x0b: signextend
  component signextend = SignExtendWithoutBitification();
  signextend.in[0] <== in[0];
  signextend.in[1] <== in[1];
  signextend.lt_out <== 1 - num2Bits.out[NUM_BITS - 1]; // lt circuit output

  // 0x10: lt
  signal lt_out;
  lt_out <== 1 - num2Bits.out[NUM_BITS - 1]; // lt circuit output

  // 0x11: gt
  signal gt_out;
  gt_out <== 1 - num2Bits.out[NUM_BITS - 1]; // gt circuit output

  // 0x12: slt
  component slt = SLTWithoutBitification(NUM_BITS);
  slt.in[0] <== in[0];
  slt.in[1] <== in[1];
  slt.lt_out <== 1 - num2Bits.out[NUM_BITS - 1]; // lt circuit output

  // 0x13: sgt
  component sgt = SLTWithoutBitification(NUM_BITS);
  sgt.in[0] <== in[1];
  sgt.in[1] <== in[0];
  sgt.lt_out <== 1 - num2Bits.out[NUM_BITS - 1]; // lt circuit output ?

  // 0x19: not
  component not = NotWithoutBitification(NUM_BITS);
  for (var i = 0; i < NUM_BITS; i++) {
    not.in[i] <== num2Bits.out[i];
  }

  // 0x1a: byte
  component byte = ByteWithoutBitification();
  byte.in[0] <== in[0];
  byte.in[1] <== in[1];
  byte.lt_out <== 1 - num2Bits.out[NUM_BITS - 1]; // lt circuit output

  // 0x1d: sar
  component sar = SARWithoutBitification(NUM_BITS);
  sar.in[0] <== in[0];
  sar.in[1] <== in[1];
  sar.sign_bit <== num2Bits.out[NUM_BITS - 1];


  // output selection
  // selects the output of the subcircuit that is selected by the selector

  // 0x0b: signextend
  inter_output[0] <== signextend.out * b_selector[0];

  // 0x10: lt
  inter_output[1] <== inter_output[0] + lt_out * b_selector[1];

  // 0x11: gt
  inter_output[2] <== inter_output[1] + gt_out * b_selector[2];

  // 0x12: slt
  inter_output[3] <== inter_output[2] + slt.out * b_selector[3];

  // 0x13: sgt
  inter_output[4] <== inter_output[3] + sgt.out * b_selector[4];

  // 0x19: not
  inter_output[5] <== inter_output[4] + not.out * b_selector[5];

  // 0x1a: byte
  inter_output[6] <== inter_output[5] + byte.out * b_selector[6];

  // 0x1d: sar
  out <== inter_output[6] + sar.out * b_selector[7];
}