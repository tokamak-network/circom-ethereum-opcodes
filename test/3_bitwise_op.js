const chai = require("chai")
const path = require("path")
const F1Field = require("ffjavascript").F1Field
const Scalar = require("ffjavascript").Scalar
const CURVE_NAME = "bn128"
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617") // bn128
const Fr = new F1Field(exports.p)
const wasm_tester = require("circom_tester").wasm
const assert = chai.assert
const MAX_VALUE = Scalar.fromString("115792089237316195423570985008687907853269984665640564039457584007913129639935") // 2**256 - 1
const { construct256BitInteger, split256BitInteger} = require("./helper_functions")

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
    it(`${test_case.in1} & ${test_case.in2} = ${res}`, async () => {
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
    it(`${test_case.in1} | ${test_case.in2} = ${res}`, async () => {
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
    it(`${test_case.in1} ^ ${test_case.in2} = ${res}`, async () => {
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
    it(`~${test_case.in} = ${res}`, async () => {
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

// describe("0x1A BYTE test", function ()  {
//   let circuit;
//   let witness;
//   before( async () => {
//     circuit = await wasm_tester(
//       path.join(__dirname, "circuits", "byte_test.circom"),
//       {
//         prime: CURVE_NAME
//       }
//     )
//   })
//   it("Should equal to 127", async() => {
//     const input = [31, 127]
//     witness = await circuit.calculateWitness({"in": input}, true)
//     assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
//     assert(
//       Fr.eq(
//         Fr.e(witness[1]), 
//         Fr.e(
//           (input[1] >> (248 - input[0] * 8)) & 255
//         )
//       )    
//     )
//   })
//   it("Should equal to 1", async() => {
//     const input = [30, 256]
//     witness = await circuit.calculateWitness({"in": input}, true)
//     assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
//     assert(
//       Fr.eq(
//         Fr.e(witness[1]), 
//         Fr.e(1)
//       )    
//     )
//   })
//   it("Should equal to 1", async() => {
//     const input = [33, 256]
//     witness = await circuit.calculateWitness({"in": input}, true)
//     assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
//     assert(
//       Fr.eq(
//         Fr.e(witness[1]), 
//         Fr.e(0)
//       )    
//     )
//   })
// })

// describe("0x1B SHL test", function ()  {
//   let circuit;
//   let witness;
//   before( async () => {
//     circuit = await wasm_tester(
//       path.join(__dirname, "circuits", "shl_test.circom"),
//       {
//         prime: CURVE_NAME
//       }
//     )
//   })
//   it("Should equal to input1 << input2", async() => {
//     const input = [3, 4]
//     witness = await circuit.calculateWitness({"in": input}, true)
//     assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
//     assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[1] << input[0])))
//   })
//   it("Should equal to 2**253", async() => {
//     const input = [253, 1]
//     witness = await circuit.calculateWitness({"in": input}, true)
//     assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
//     assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE + Scalar.fromString('1'))))
//   })
//   it("Should equal to zero", async() => {
//     const input = [100, 0]
//     witness = await circuit.calculateWitness({"in": input}, true)
//     assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
//     assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
//   })
// })

// describe("0x1C SHR test", function ()  {
//   let circuit;
//   let witness;
//   before( async () => {
//     circuit = await wasm_tester(
//       path.join(__dirname, "circuits", "shr_test.circom"),
//       {
//         prime: CURVE_NAME
//       }
//     )
//   })
//   it("Should equal to input1 >> input2", async() => {
//     const input = [15, 2]
//     witness = await circuit.calculateWitness({"in": input}, true)
//     assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
//     assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[1] >>> input[0])))
//   })
//   it("Should equal to zero", async() => {
//     const input = [253, MAX_VALUE]
//     witness = await circuit.calculateWitness({"in": input}, true)
//     assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
//     assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
//   })
//   it("Should equal to zero", async() => {
//     const input = [100, 0]
//     witness = await circuit.calculateWitness({"in": input}, true)
//     assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
//     assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
//   })
// })

// describe("0x1D SAR test", function ()  {
//   let circuit;
//   let witness;
//   before( async () => {
//     circuit = await wasm_tester(
//       path.join(__dirname, "circuits", "sar_test.circom"),
//       {
//         prime: CURVE_NAME
//       }
//     )
//   })
//   it("Should zero-fill right shift", async() => {
//     const input = [15, 2]
//     witness = await circuit.calculateWitness({"in": input}, true)
//     assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
//     assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[1] >>> input[0])))
//   })
//   it("Should fill signed bit in msb", async() => {
//     const input = [Scalar.fromString('2'), MAX_VALUE]
//     witness = await circuit.calculateWitness({"in": input}, true)
//     assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
//     assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE)))
//   })
// })