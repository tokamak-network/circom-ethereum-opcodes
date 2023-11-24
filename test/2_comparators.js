const chai = require("chai")
const path = require("path")
const F1Field = require("ffjavascript").F1Field
const Scalar = require("ffjavascript").Scalar
exports.p = Scalar.fromString("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab") // BLS12-381 prime
const Fr = new F1Field(exports.p)
const wasm_tester = require("circom_tester").wasm
const assert = chai.assert
const MAX_VALUE = Scalar.fromString("115792089237316195423570985008687907853269984665640564039457584007913129639935") // 2**256 - 1
describe("0x10 LT test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "lt_test.circom"))
  })
  it("Should equal to one", async() => {
    const input = [1, 200]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [200, 1]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [
      exports.p,
      Scalar.fromString("3")
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
})

describe("0x11 GT test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "gt_test.circom"))
  })
  it("Should equal to zero", async() => {
    const input = [1, 200]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [200, 1]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [
      exports.p,
      Scalar.fromString("3")
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x12 SLT test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "slt_test.circom"))
  })
  it("Should equal to one", async() => {
    const input = [1, 200]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [1000, 200]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [
      MAX_VALUE - Scalar.fromString('1'),
      Scalar.fromString("100")
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [
      Scalar.fromString("100"),
      MAX_VALUE - Scalar.fromString('1')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [
      MAX_VALUE - Scalar.fromString('5'),
      MAX_VALUE - Scalar.fromString('1')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [
      MAX_VALUE - Scalar.fromString('1'),
      MAX_VALUE - Scalar.fromString('5')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x13 SGT test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "sgt_test.circom"))
  })
  it("Should equal to one", async() => {
    const input = [200, 1]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [1, 200]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [
      Scalar.fromString("100"),
      MAX_VALUE - Scalar.fromString('1')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [
      MAX_VALUE - Scalar.fromString('1'),
      Scalar.fromString("100")
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [
      MAX_VALUE - Scalar.fromString('1'),
      MAX_VALUE - Scalar.fromString('5')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [
      MAX_VALUE - Scalar.fromString('5'),
      MAX_VALUE - Scalar.fromString('1')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x14 EQ test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "eq_test.circom"))
  })
  it("Should equal to zero", async() => {
    const input = [1, 200]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [200, 200]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to one", async() => {
    const input = [
      exports.p + Scalar.fromString('1'),
      Scalar.fromString("1")
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
})

describe("0x15 ISZERO test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "iszero_test.circom"))
  })
  it("Should equal to zero", async() => {
    const input = 0
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to one", async() => {
    const input = 100
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero", async() => {
    const input = exports.p
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
})