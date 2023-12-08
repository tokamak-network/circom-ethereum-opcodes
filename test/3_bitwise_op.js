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

describe("0x16 AND test", function ()  {
  let circuit;
  let witness;
  const test_cases = [
    {
      "in1": BigInt(100),
      "in2": BigInt(100)
    },
    {
      "in1": BigInt(2**128),
      "in2": BigInt(0)
    },
    {
      "in1": BigInt(2**254),
      "in2": BigInt(2)
    },
    {
      "in1": BigInt(30),
      "in2": BigInt(30 * 2**128)
    },
    {
      "in1": BigInt(2**256) - BigInt(1),
      "in2": BigInt(200)
    },
  ]
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
  const test_cases = [
    {
      "in1": BigInt(100),
      "in2": BigInt(100)
    },
    {
      "in1": BigInt(2**128),
      "in2": BigInt(0)
    },
    {
      "in1": BigInt(2**254),
      "in2": BigInt(2)
    },
    {
      "in1": BigInt(30),
      "in2": BigInt(30 * 2**128)
    },
    {
      "in1": BigInt(2**256) - BigInt(1),
      "in2": BigInt(200)
    },
  ]
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
  const test_cases = [
    {
      "in1": BigInt(100),
      "in2": BigInt(100)
    },
    {
      "in1": BigInt(2**128),
      "in2": BigInt(0)
    },
    {
      "in1": BigInt(2**254),
      "in2": BigInt(2)
    },
    {
      "in1": BigInt(30),
      "in2": BigInt(30 * 2**128)
    },
    {
      "in1": BigInt(2**256) - BigInt(1),
      "in2": BigInt(200)
    },
  ]
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
  const test_cases = [
    {
      "in": BigInt(100)
    },
    {
      "in": BigInt(0)
    },
    {
      "in": BigInt(2**254)
    },
    {
      "in": BigInt(30)
    },
    {
      "in": BigInt(2**256) - BigInt(1)
    },
  ]
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
  const test_cases = [
    {
      "in1": BigInt(0),
      "in2": BigInt(0x12345678),
    },
    {
      "in1": BigInt(31),
      "in2": BigInt(0x12345678),
    },
    {
      "in1": BigInt(32),
      "in2": BigInt(0x12345678),
    },
    {
      "in1": BigInt(2**256 - 1),
      "in2": BigInt(0x12345678),
    },
    {
      "in1": BigInt(0),
      "in2": BigInt(0x12345678) * BigInt(2**128),
    },
    {
      "in1": BigInt(12),
      "in2": BigInt(0x12345678) * BigInt(2**128),
    },
    {
      "in1": BigInt(15),
      "in2": BigInt(0x12345678) * BigInt(2**128),
    },
    {
      "in1": BigInt(16),
      "in2": BigInt(0x12345678) * BigInt(2**128),
    },
    {
      "in1": BigInt(28),
      "in2":BigInt(0x12345678) * BigInt(2**128),
    },
  ]
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
    it(`Extract a single byte from 0x${test_case.in2.toString(16).padStart(64, '0')} at index ${test_case.in1 * 8n} 
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
  const test_cases = [
    {
      "in1": BigInt(10),
      "in2": BigInt(2**10),
    },
    {
      "in1": BigInt(1),
      "in2": BigInt(2**128),
    },
    {
      "in1": BigInt(500),
      "in2": BigInt(3**30),
    },
    {
      "in1": BigInt(50),
      "in2": BigInt(7),
    },
    {
      "in1": BigInt(128),
      "in2": BigInt(2**128) - BigInt(1),
    },
    {
      "in1": BigInt(200),
      "in2": BigInt(2**250) - BigInt(1),
    },
  ]
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
  const test_cases = [
    {
      "in1": BigInt(0),
      "in2": BigInt(2**255),
    },
    {
      "in1": BigInt(64),
      "in2": BigInt(2**255),
    },
    {
      "in1": BigInt(128),
      "in2": BigInt(2**255),
    },
    {
      "in1": BigInt(196),
      "in2": BigInt(2**255),
    },
    {
      "in1": BigInt(256),
      "in2": BigInt(2**255),
    },
    {
      "in1": BigInt(1),
      "in2": BigInt(2**128),
    },
    {
      "in1": BigInt(500),
      "in2": BigInt(3**30),
    },
    {
      "in1": BigInt(10),
      "in2": BigInt(2**256) - BigInt(1),
    },
    {
      "in1": BigInt(255),
      "in2": BigInt(2**256) - BigInt(1),
    },
    {
      "in1": BigInt(256),
      "in2": BigInt(2**256) - BigInt(1),
    },
    {
      "in1": BigInt(128),
      "in2": BigInt(2**128) - BigInt(1),
    },
    {
      "in1": BigInt(200),
      "in2": BigInt(2**255) - BigInt(1),
    },
  ]
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