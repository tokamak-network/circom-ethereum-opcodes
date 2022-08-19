const chai = require("chai")
const path = require("path")
const F1Field = require("ffjavascript").F1Field
const Scalar = require("ffjavascript").Scalar
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617")
const Fr = new F1Field(exports.p)
const wasm_tester = require("circom_tester").wasm
const assert = chai.assert
const MAX_VALUE = Scalar.fromString('14474011154664524427946373126085988481658748083205070504932198000989141204991') // 2**253 - 1

describe("0x16 AND test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "and_test.circom"))
  })
  it("Should equal to bit and result", async() => {
    const input = [201, 49]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] & input[1])))
  })
  it("Should equal to the second input", async() => {
    const input = [
      MAX_VALUE,
      Scalar.fromString('0x19')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[1])))
  })
})

describe("0x17 OR test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "or_test.circom"))
  })
  it("Should equal to bit or result", async() => {
    const input = [201, 49]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] | input[1])))
  })
  it("Should equal to the first input", async() => {
    const input = [
      MAX_VALUE,
      Scalar.fromString('0x19')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0])))
  })
})

describe("0x18 XOR test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "xor_test.circom"))
  })
  it("Should equal to bit xor result", async() => {
    const input = [201, 49]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] ^ input[1])))
  })
  it("Should equal to bit xor result", async() => {
    const input = [
      MAX_VALUE,
      Scalar.fromString('0x19')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] ^ input[1])))
  })
})

describe("0x19 NOT test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "not_test.circom"))
  })
  it("Should equal to one", async() => {
    const input = Scalar.fromString('10')
    witness = await circuit.calculateWitness({
      "in": MAX_VALUE - input
    }, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input)))
  })
  it("Should equal to zero", async() => {
    const input = MAX_VALUE
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x1B SHL test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "shl_test.circom"))
  })
  it("Should equal to input1 << input2", async() => {
    const input = [3, 4]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[1] << input[0])))
  })
  it("Should equal to 2**253", async() => {
    const input = [253, 1]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE + Scalar.fromString('1'))))
  })
  it("Should equal to zero", async() => {
    const input = [100, 0]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x1C SHR test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "shr_test.circom"))
  })
  it("Should equal to input1 >> input2", async() => {
    const input = [15, 2]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[1] >>> input[0])))
  })
  it("Should equal to zero", async() => {
    const input = [253, MAX_VALUE]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero", async() => {
    const input = [100, 0]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x1D SAR test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "sar_test.circom"))
  })
  it("Should zero-fill right shift", async() => {
    const input = [15, 2]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[1] >>> input[0])))
  })
  it("Should fill signed bit in msb", async() => {
    const input = [Scalar.fromString('2'), MAX_VALUE]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE)))
  })
})