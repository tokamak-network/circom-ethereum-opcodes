pragma circom 2.0.5;
include "../add.circom";
include "../mul.circom";
include "../sub.circom";
include "../div.circom";
include "../sdiv.circom";
include "../mod.circom";
include "../smod.circom";
include "../addmod.circom";
include "../mulmod.circom";
include "../exp.circom";
include "../shl.circom";
include "../shr_l.circom";
include "../shr_h.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";


template ALU () {
  var NUM_FUNCTIONS = 15; // number of functions in the ALU

  // signal definitions
  signal input in[3], b_selector[NUM_FUNCTIONS];
  signal output out;
  signal inter[NUM_FUNCTIONS - 1]; // intermediate signals to prevent non-quadratic constraints // 

  // operator 0x01: add
  component add = Add();
  add.in[0] <== in[0];
  add.in[1] <== in[1];
  inter[0] <== b_selector[0] * add.out;

  // operator 0x02: mul
  component mul = Mul();
  mul.in[0] <== in[0];
  mul.in[1] <== in[1];
  inter[1] <== inter[0] + b_selector[1] * mul.out;

  // operator 0x03: sub
  component sub = Sub();
  sub.in[0] <== in[0];
  sub.in[1] <== in[1];
  inter[2] <== inter[1] + b_selector[2] * sub.out;

  // operator 0x04: div
  component div = Div();
  div.in[0] <== in[0];
  div.in[1] <== in[1];
  inter[3] <== inter[2] + b_selector[3] * div.out;

  // operator 0x05: sdiv
  component sdiv = Sdiv();
  sdiv.in[0] <== in[0];
  sdiv.in[1] <== in[1];
  inter[4] <== inter[3] + b_selector[4] * sdiv.out;

  // operator 0x06: mod
  component mod = Mod();
  mod.in[0] <== in[0];
  mod.in[1] <== in[1];
  inter[5] <== inter[4] + b_selector[5] * mod.out;

  // operator 0x07: smod
  component smod = Smod();
  smod.in[0] <== in[0];
  smod.in[1] <== in[1];
  inter[6] <== inter[5] + b_selector[6] * smod.out;

  // operator 0x08: addmod
  component addmod = AddMod();
  addmod.in[0] <== in[0];
  addmod.in[1] <== in[1];
  addmod.in[2] <== in[2];
  inter[7] <== inter[6] + b_selector[7] * addmod.out;

  // operator 0x09: mulmod
  component mulmod = MulMod();
  mulmod.in[0] <== in[0];
  mulmod.in[1] <== in[1];
  mulmod.in[2] <== in[2];
  inter[8] <== inter[7] + b_selector[8] * mulmod.out;

  // operator 0x0a: exp
  component exp = Exp();
  exp.in[0] <== in[0];
  exp.in[1] <== in[1];
  inter[9] <== inter[8] + b_selector[9] * exp.out;

  // operator 0x14: eq
  component eq = IsEqual();
  eq.in[0] <== in[0];
  eq.in[1] <== in[1];
  inter[10] <== inter[9] + b_selector[10] * eq.out;

  // operator 0x15: iszero
  component iszero = IsZero();
  iszero.in <== in[0];
  inter[11] <== inter[10] + b_selector[11] * iszero.out;

  // operator 0x1b: shl
  component shl = SHL();
  shl.in[0] <== in[0];
  shl.in[1] <== in[1];
  inter[12] <== inter[11] + b_selector[12] * shl.out;

  // operator 0x1c is divided into two operators: shr-l and shr-r due to the lack of support for 256bit shift
  //    operator 0x1c1: shr-l
  component shr_l = SHR_L();
  shr_l.in[0] <== in[0];
  shr_l.in[1] <== in[1];
  inter[13] <== inter[12] + b_selector[13] * shr_l.out;

  //    operator 0x1c2: shr-h
  component shr_h = SHR_H();
  shr_h.in[0] <== in[0];
  shr_h.in[1] <== in[1];
  out <== inter[13] + b_selector[14] * shr_h.out; // output
}