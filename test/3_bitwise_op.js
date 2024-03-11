const chai = require("chai")
const path = require("path")
const F1Field = require("ffjavascript").F1Field
const Scalar = require("ffjavascript").Scalar
const CURVE_NAME = "bn128"
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617") // bn128
const Fr = new F1Field(exports.p)
const wasm_tester = require("circom_tester").wasm
const assert = chai.assert
const { split256BitInteger, sar256BitInteger, getByte} = require("./helper_functions")
const test_case = require("./test_cases.js")

describe("0x16 AND test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.and
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "and_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = test_case.in1 & test_case.in2
    const out = split256BitInteger(res)
    it(`0x${test_case.in1.toString(16).padStart(64, '0')} 
    & 0x${test_case.in2.toString(16).padStart(64, '0')} 
    = 0x${res.toString(16).padStart(64, '0')}\n`, async () => {
      witness = await circuit.calculateWitness(
        {
          "in1": in1,
          "in2": in2
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})

describe("0x17 OR test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.or
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "or_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = test_case.in1 | test_case.in2
    const out = split256BitInteger(res)
    it(`0x${test_case.in1.toString(16).padStart(64, '0')}
    | 0x${test_case.in2.toString(16).padStart(64, '0')} 
    = 0x${res.toString(16).padStart(64, '0')}\n`, async () => {
      witness = await circuit.calculateWitness(
        {
          "in1": in1,
          "in2": in2
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})

describe("0x18 XOR test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.xor
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "xor_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = test_case.in1 ^ test_case.in2
    const out = split256BitInteger(res)
    it(`0x${test_case.in1.toString(16).padStart(64, '0')}
    ^ 0x${test_case.in2.toString(16).padStart(64, '0')} 
    = 0x${res.toString(16).padStart(64, '0')}\n`, async () => {
      witness = await circuit.calculateWitness(
        {
          "in1": in1,
          "in2": in2
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})

describe("0x19 NOT test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.not
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "not_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const input = split256BitInteger(test_case.in)
    const bitmask = (1n << 256n) - 1n;
    const res = test_case.in ^ bitmask; // Invert the bits using XOR (^) with the bitmask
    const out = split256BitInteger(res)
    it(`~ 0x${test_case.in.toString(16).padStart(64, '0')} 
      = 0x${res.toString(16).padStart(64, '0')}\n`, async () => {
      witness = await circuit.calculateWitness(
        {
          "in": input
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})

describe("0x1A BYTE test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.byte
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "byte_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = getByte(test_case.in1, test_case.in2)
    const out = split256BitInteger(res)
    it(`Extract a single byte from 0x${test_case.in2.toString(16).padStart(64, '0')} at index ${test_case.in1} 
                               = 0x${res.toString(16).padStart(64, '0')}\n`, async () => {
      witness = await circuit.calculateWitness(
        {
          "in1": in1,
          "in2": in2
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})

describe("0x1B SHL test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.shl
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "shl_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = (test_case.in2 << test_case.in1) % 2n**256n
    const out = split256BitInteger(res)
    it(`0x${test_case.in2.toString(16).padStart(64, '0')} << ${test_case.in1} 
    = 0x${res.toString(16).padStart(64, '0')}\n`, async () => {
      witness = await circuit.calculateWitness(
        {
          "in1": in1,
          "in2": in2
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})

describe("0x1C SHR test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.shr
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "shr_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = (test_case.in2 >> test_case.in1) % 2n**256n
    const out = split256BitInteger(res)
    it(`0x${test_case.in2.toString(16).padStart(64, '0')} >> ${test_case.in1} 
    = 0x${res.toString(16).padStart(64, '0')}\n`, async () => {
      witness = await circuit.calculateWitness(
        {
          "in1": in1,
          "in2": in2
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})

describe("0x1D SAR test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.sar
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "sar_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = sar256BitInteger(test_case.in2, test_case.in1)
    const out = split256BitInteger(res)
    it(`0x${test_case.in2.toString(16).padStart(64, '0')} >>> ${test_case.in1} 
    = 0x${res.toString(16).padStart(64, '0')}\n`, async () => {
      witness = await circuit.calculateWitness(
        {
          "in1": in1,
          "in2": in2
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})