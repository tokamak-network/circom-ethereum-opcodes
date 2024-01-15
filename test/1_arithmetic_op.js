const chai = require("chai")
const path = require("path")
const F1Field = require("ffjavascript").F1Field
const Scalar = require("ffjavascript").Scalar
const CURVE_NAME = "bn128"
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617") // bn128
const Fr = new F1Field(exports.p)
const wasm_tester = require("circom_tester").wasm
const assert = chai.assert
const { split256BitInteger, signExtend, signedDivide, signedMod} = require("./helper_functions")
const test_case = require("./test_cases.js")

describe("0x01 ADD test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.add
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "add_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = (test_case.in1 + test_case.in2) % 2n**256n
    const out = split256BitInteger(res)
    it(`0x${test_case.in1.toString(16).padStart(64, '0')} 
    + 0x${test_case.in2.toString(16).padStart(64, '0')}
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

describe("0x02 MUL test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.mul
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "mul_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = (test_case.in1 * test_case.in2) % 2n**256n
    const out = split256BitInteger(res)
    it(`0x${test_case.in1.toString(16).padStart(64, '0')} 
    * 0x${test_case.in2.toString(16).padStart(64, '0')}
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

describe("0x03 SUB test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.sub
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "sub_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = (2n**256n + test_case.in1 - test_case.in2) % 2n**256n
    const out = split256BitInteger(res)
    it(`0x${test_case.in1.toString(16).padStart(64, '0')} 
    - 0x${test_case.in2.toString(16).padStart(64, '0')}
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

describe("0x04 DIV test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.div
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "div_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = test_case.in2 != 0 ? test_case.in1 / test_case.in2 : 0
    const out = split256BitInteger(res)
    it(`0x${test_case.in1.toString(16).padStart(64, '0')} 
   // 0x${test_case.in2.toString(16).padStart(64, '0')}
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

describe("0x05 SDIV test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.sdiv
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "sdiv_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = signedDivide(test_case.in1, test_case.in2)
    const out = split256BitInteger(res)
    it(`0x${test_case.in1.toString(16).padStart(64, '0')} 
  // 0x${test_case.in2.toString(16).padStart(64, '0')}
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

describe("0x06 MOD test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.mod
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "mod_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = test_case.in2 != 0 ? (test_case.in1 % test_case.in2) : 0
    const out = split256BitInteger(res)
    it(`0x${test_case.in1.toString(16).padStart(64, '0')} 
    % 0x${test_case.in2.toString(16).padStart(64, '0')}
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

describe("0x07 SMOD test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.smod
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "smod_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = signedMod(test_case.in1, test_case.in2)
    const out = split256BitInteger(res)
    it(`0x${test_case.in1.toString(16).padStart(64, '0')} 
    % 0x${test_case.in2.toString(16).padStart(64, '0')}
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

describe("0x08 ADDMOD test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.addmod
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "addmod_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const in3 = split256BitInteger(test_case.in3)
    const res = test_case.in3 != 0 ? ((test_case.in1 + test_case.in2) % 2n**256n) % test_case.in3 : 0
    const out = split256BitInteger(res)
    it(`(0x${test_case.in1.toString(16).padStart(64, '0')} 
    + 0x${test_case.in2.toString(16).padStart(64, '0')})
    % 0x${test_case.in3.toString(16).padStart(64, '0')}
    = 0x${res.toString(16).padStart(64, '0')}\n`, async () => {
      witness = await circuit.calculateWitness(
        {
          "in1": in1,
          "in2": in2,
          "in3": in3,
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})

describe("0x09 MULMOD test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.mulmod
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "mulmod_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const in3 = split256BitInteger(test_case.in3)
    const res = test_case.in3 != 0 ? ((test_case.in1 * test_case.in2) % 2n**256n) % test_case.in3 : 0
    const out = split256BitInteger(res)
    it(`(0x${test_case.in1.toString(16).padStart(64, '0')} 
    * 0x${test_case.in2.toString(16).padStart(64, '0')})
    % 0x${test_case.in3.toString(16).padStart(64, '0')}
    = 0x${res.toString(16).padStart(64, '0')}\n`, async () => {
      witness = await circuit.calculateWitness(
        {
          "in1": in1,
          "in2": in2,
          "in3": in3,
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})

describe("0x0A EXP test", function ()  {
    let circuit;
    let witness;
    const test_cases = test_case.exp
    before(async () => {
      circuit = await wasm_tester(
        path.join(__dirname, "circuits", "exp_test.circom"),
        {
          prime: CURVE_NAME
        }
      )
    })
    for (const test_case of test_cases) {
      const in1 = split256BitInteger(test_case.in1)
      const in2 = split256BitInteger(test_case.in2)
      const res = (test_case.in1 ** test_case.in2) % 2n**256n
      const out = split256BitInteger(res)
      it(`0x${test_case.in1.toString(16).padStart(64, '0')} ** 0x${test_case.in2.toString(16)}
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

// 0x0B SINGEXTEND
describe("0x0B SIGNEXTEND test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.signextend
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "signextend_test.circom"),
      {
        prime: CURVE_NAME
      }
    )
  })
  for (const test_case of test_cases) {
    const in1 = split256BitInteger(test_case.in1)
    const in2 = split256BitInteger(test_case.in2)
    const res = signExtend(test_case.in1, test_case.in2)
    const out = split256BitInteger(res)
    it(`Extend length of two's complement signed integer ${test_case.in2.toString(16).padStart(64, '0')} at position of ${(test_case.in1 + 1n) * 8n} 
                                                    => ${res.toString(16).padStart(64, '0')}\n`, async () => {
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