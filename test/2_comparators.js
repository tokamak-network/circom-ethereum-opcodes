const chai = require("chai")
const path = require("path")
const F1Field = require("ffjavascript").F1Field
const Scalar = require("ffjavascript").Scalar
const CURVE_NAME = "bn128"
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617") // bn128
const Fr = new F1Field(exports.p)
const wasm_tester = require("circom_tester").wasm
const assert = chai.assert
const { split256BitInteger, signedLessThan256BitInteger} = require("./helper_functions")
const test_case = require("./test_cases.js")

const one_input_cases = [];
const two_input_cases = [];

for(let i = 0; i <= 256; i++) {
  const in1 = (BigInt(3)**BigInt(i)+BigInt(1)) % BigInt(2**256);
  const in2 = (BigInt(5)**BigInt(i)+BigInt(1)) % BigInt(2**256);

  one_input_cases.push({in: in1});
  two_input_cases.push({in1: in1, in2: in2});
}

describe("0x10 LT test", function ()  {
  let circuit;
  let witness;
  const test_cases = [...two_input_cases, ...test_case.lt]; //edge cases + normal cases
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "lt_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = (test_case.in1 < test_case.in2) ? BigInt(1) : BigInt(0)
    const out = split256BitInteger(res)
    it(`0x${test_case.in1.toString(16).padStart(64, '0')} < 0x${test_case.in2.toString(16).padStart(64, '0')} = ${res ? "True" : "False"}`, async () => {
      witness = await circuit.calculateWitness(
        {
          "in": [in1, in2]
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})

describe("0x11 GT test", function ()  {
  let circuit;
  let witness;
  const test_cases = [...two_input_cases, ...test_case.gt]; //edge cases + normal cases
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "gt_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = (test_case.in1 > test_case.in2) ? BigInt(1) : BigInt(0)
    const out = split256BitInteger(res)
    it(`0x${test_case.in1.toString(16).padStart(64, '0')} > 0x${test_case.in2.toString(16).padStart(64, '0')} = ${res ? "True" : "False"}`, async () => {
      witness = await circuit.calculateWitness(
        {
          "in": [in1, in2]
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})

describe("0x12 SLT test", function ()  {
  let circuit;
  let witness;
  const test_cases = [...two_input_cases, ...test_case.slt]; //edge cases + normal cases
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "slt_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = signedLessThan256BitInteger(test_case.in1, test_case.in2)
    const out = split256BitInteger(res)
    it(`0x${test_case.in1.toString(16).padStart(64, '0')} < 0x${test_case.in2.toString(16).padStart(64, '0')} = ${res ? "True" : "False"}`, async () => {
      witness = await circuit.calculateWitness(
        {
          "in": [in1, in2]
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})

describe("0x13 SGT test", function ()  {
  let circuit;
  let witness;
  const test_cases = [...two_input_cases, ...test_case.sgt]; //edge cases + normal cases
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "sgt_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = signedLessThan256BitInteger(test_case.in2, test_case.in1)
    const out = split256BitInteger(res)
    it(`0x${test_case.in1.toString(16).padStart(64, '0')} > 0x${test_case.in2.toString(16).padStart(64, '0')} = ${res ? "True" : "False"}`, async () => {
      witness = await circuit.calculateWitness(
        {
          "in": [in1, in2]
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})

describe("0x14 EQ test", function ()  {
  let circuit;
  let witness;
  const test_cases = [...two_input_cases, ...test_case.eq]; //edge cases + normal cases
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "eq_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = (test_case.in1 == test_case.in2) ? BigInt(1) : BigInt(0)
    const out = split256BitInteger(res)
    it(`0x${test_case.in1.toString(16).padStart(64, '0')} == 0x${test_case.in2.toString(16).padStart(64, '0')} = ${res ? "True" : "False"}`, async () => {
      witness = await circuit.calculateWitness(
        {
          "in": [in1, in2]
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})

describe("0x15 ISZERO test", function ()  {
  let circuit;
  let witness;
  const test_cases = [...one_input_cases, ...test_case.iszero]; //edge cases + normal cases
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "iszero_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const input = split256BitInteger(test_case.in)
    const res = (test_case.in == 0 ) ? BigInt(1) : BigInt(0)
    const out = split256BitInteger(res)
    it(`0x${test_case.in.toString(16).padStart(64, '0')} == 0x0 => ${res ? "True" : "False"}`, async () => {
      witness = await circuit.calculateWitness(
        {
          "in": [input]
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})