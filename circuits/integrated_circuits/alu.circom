pragma circom 2.1.6;
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
include "../signextend.circom";
include "../eq.circom";
include "../byte.circom";
include "../shl.circom";
include "../shr.circom";
include "../sar.circom";
include "../../node_modules/circomlib/circuits/bitify.circom";

template ALU () {
  var NUM_FUNCTIONS = 14; // number of functions in the ALU

  // signal definitions
  signal input in[3][2], selector;
  signal inter[NUM_FUNCTIONS - 1][2]; // intermediate signals to prevent non-quadratic constraints

  // selector bitification
  signal b_selector[NUM_FUNCTIONS] <== Num2Bits(NUM_FUNCTIONS)(selector);

  // operator 0x01: add
  signal add_out[2] <== Add()(in[0], in[1]);
  inter[0] <== [
    b_selector[0] * add_out[0],
    b_selector[0] * add_out[1]
  ];

  // operator 0x02: mul
  signal mul_out[2] <== Mul()(in[0], in[1]);
  inter[1] <== [
    inter[0][0] + b_selector[1] * mul_out[0],
    inter[0][1] + b_selector[1] * mul_out[1]
  ];

  // operator 0x03: sub
  signal sub_out[2] <== Sub()(in[0], in[1]);
  inter[2] <== [
    inter[1][0] + b_selector[2] * sub_out[0],
    inter[1][1] + b_selector[2] * sub_out[1]
  ];

  // operator 0x04: div
  signal div_out[2] <== Div()(in[0], in[1]);
  inter[3] <== [
    inter[2][0] + b_selector[3] * div_out[0],
    inter[2][1] + b_selector[3] * div_out[1]
  ];

  // operator 0x05: sdiv
  signal sdiv_out[2] <== SDiv()(in[0], in[1]);
  inter[4] <== [
    inter[3][0] + b_selector[4] * sdiv_out[0],
    inter[3][1] + b_selector[4] * sdiv_out[1]
  ];

  // operator 0x06: mod
  signal mod_out[2] <== Mod()(in[0], in[1]);
  inter[5] <== [
    inter[4][0] + b_selector[5] * mod_out[0],
    inter[4][1] + b_selector[5] * mod_out[1]
  ];

  // operator 0x07: smod
  signal smod_out[2] <== SMod()(in[0], in[1]);
  inter[6] <== [
    inter[5][0] + b_selector[6] * smod_out[0],
    inter[5][1] + b_selector[6] * smod_out[1]
  ];

  // operator 0x08: addmod
  signal addmod_out[2] <== AddMod()(in[0], in[1], in[2]);
  inter[7] <== [
    inter[6][0] + b_selector[7] * addmod_out[0],
    inter[6][1] + b_selector[7] * addmod_out[1]
  ];

  // operator 0x09: mulmod
  signal mulmod_out[2] <== MulMod()(in[0], in[1], in[2]);
  inter[8] <== [
    inter[7][0] + b_selector[8] * mulmod_out[0],
    inter[7][1] + b_selector[8] * mulmod_out[1]
  ];

  // operator 0x0a: exp
  signal exp_out[2] <== Exp()(in[0], in[1]);
  inter[9] <== [
    inter[8][0] + b_selector[9] * exp_out[0],
    inter[8][1] + b_selector[9] * exp_out[1]
  ];

  // operator 0x0b: signextend
  signal signextend_out[2] <== SignExtend()(in[0], in[1]);
  inter[10] <== [
    inter[9][0] + b_selector[10] * signextend_out[0],
    inter[9][1] + b_selector[10] * signextend_out[1]
  ];

  // operator 0x14: eq
  signal eq_out[2] <== Eq()(in[0], in[1]);
  inter[11] <== [
    inter[10][0] + b_selector[11] * eq_out[0],
    inter[10][1] + b_selector[11] * eq_out[1]
  ];

  // operator 0x15: iszero
  signal iszero_out[2] <== IsZero256()(in[0]);
  inter[12] <== [
    inter[11][0] + b_selector[12] * iszero_out[0],
    inter[11][1] + b_selector[12] * iszero_out[1]
  ];

  // operator 0x1a: byte
  signal byte_out[2] <== Byte()(in[0], in[1]);
  signal output out[2] <== [
    inter[12][0] + b_selector[13] * byte_out[0],
    inter[12][1] + b_selector[13] * byte_out[1]
  ];
}