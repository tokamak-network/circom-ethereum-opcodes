const chai = require("chai")
const path = require("path")
const F1Field = require("ffjavascript").F1Field
const Scalar = require("ffjavascript").Scalar
const CURVE_NAME = "bn128"
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617") // bn128
const Fr = new F1Field(exports.p)
const wasm_tester = require("circom_tester").wasm
const assert = chai.assert
const { split256BitInteger, signExtend, signedDivide, signedMod, signedLessThan256BitInteger, getByte, sar256BitInteger} = require("./helper_functions")
const test_case = require("./test_cases.js")

describe("0x01 ADD test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.add
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "alu_test.circom"),
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
          "in": [in1, in2, [0, 0]],
          "selector": 2n**0n
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
      path.join(__dirname, "circuits", "alu_test.circom"),
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
          "in": [in1, in2, [0, 0]],
          "selector": 2n**1n
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
      path.join(__dirname, "circuits", "alu_test.circom"),
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
          "in": [in1, in2, [0, 0]],
          "selector": 2n**2n
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
      path.join(__dirname, "circuits", "alu_test.circom"),
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
          "in": [in1, in2, [0, 0]],
          "selector": 2n**3n
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
      path.join(__dirname, "circuits", "alu_test.circom"),
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
          "in": [in1, in2, [0, 0]],
          "selector": 2n**4n
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
      path.join(__dirname, "circuits", "alu_test.circom"),
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
          "in": [in1, in2, [0, 0]],
          "selector": 2n**5n
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
      path.join(__dirname, "circuits", "alu_test.circom"),
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
          "in": [in1, in2, [0, 0]],
          "selector": 2n**6n
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
      path.join(__dirname, "circuits", "alu_test.circom"),
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
          "in": [in1, in2, in3],
          "selector": 2n**7n
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
      path.join(__dirname, "circuits", "alu_test.circom"),
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
          "in": [in1, in2, in3],
          "selector": 2n**8n
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
        path.join(__dirname, "circuits", "alu_test.circom"),
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
            "in": [in1, in2, [0, 0]],
            "selector": 2n**9n
          }, 
          true
        );
        assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
        assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
      });
    }
  })

describe("0x0B SIGNEXTEND test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.signextend
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "alu_test.circom"),
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
          "in": [in1, in2, [0, 0]],
          "selector": 2n**10n
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})

describe("0x10 LT test", function ()  {
  let circuit;
  let witness;
  const test_cases = test_case.lt
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "mlu_test.circom"),
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
          "in": [in1, in2],
          "selector": 2n**0n
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
  const test_cases = test_case.gt
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "mlu_test.circom"),
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
          "in": [in1, in2],
          "selector": 2n**1n
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
  const test_cases = test_case.slt
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "mlu_test.circom"),
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
          "in": [in1, in2],
          "selector": 2n**2n
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
  const test_cases = test_case.sgt
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "mlu_test.circom"),
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
          "in": [in1, in2],
          "selector": 2n**3n
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
  const test_cases = test_case.eq
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "alu_test.circom"),
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
          "in": [in1, in2, [0, 0]],
          "selector": 2n**11n
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
  const test_cases = test_case.iszero
  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "alu_test.circom"),
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
          "in": [input, [0, 0], [0, 0]],
          "selector": 2n**12n
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
      path.join(__dirname, "circuits", "mlu_test.circom"),
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
          "in": [input, [0, 0]],
          "selector": 2n**4n
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
      path.join(__dirname, "circuits", "alu_test.circom"),
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
          "in": [in1, in2, [0, 0]],
          "selector": 2n**13n
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
      path.join(__dirname, "circuits", "mlu_test.circom"),
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
          "in": [in1, in2],
          "selector": 2n**5n
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
      path.join(__dirname, "circuits", "mlu_test.circom"),
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
          "in": [in1, in2],
          "selector": 2n**6n
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
      path.join(__dirname, "circuits", "mlu_test.circom"),
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
          "in": [in1, in2],
          "selector": 2n**7n
        }, 
        true
      );
      assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(out[0])));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(out[1])));
    });
  }
})