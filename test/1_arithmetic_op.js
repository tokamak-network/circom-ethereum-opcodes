const chai = require("chai")
const path = require("path")
const F1Field = require("ffjavascript").F1Field
const Scalar = require("ffjavascript").Scalar
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617")
const Fr = new F1Field(exports.p)
const wasm_tester = require("circom_tester").wasm
const assert = chai.assert
const MAX_VALUE = Scalar.fromString("14474011154664524427946373126085988481658748083205070504932198000989141204991")

describe("0x01 ADD test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "add_test.circom"))
  })
  it("Should equal to sum of two small inputs", async() => {
    const input = [20, 6]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] + input[1])))
  })
  it("Should equal to sum of two big enough inputs", async() => {
    const input = [
      MAX_VALUE + Scalar.fromString("1"), 
      MAX_VALUE + Scalar.fromString("1")
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] + input[1])))
  })
  it("Should equal to zero", async() => {
    const input = [
      Scalar.fromString("1"),
      exports.p - Scalar.fromString('1')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})


describe("0x02 MUL test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "mul_test.circom"))
  })
  it("Should equal to product of two small inputs", async() => {
    const input = [20, 9]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] * input[1])))
  })
  it("Should equal to product of two big enough inputs", async() => {
    const input = [
      MAX_VALUE + Scalar.fromString("1"),
      Scalar.fromString("81221")
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] * input[1])))
  })
  it("Should equal to zero", async() => {
    const input = [
      exports.p - Scalar.fromString('1'),
      Scalar.fromString("0")
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})
describe("0x03 SUB test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "sub_test.circom"))
  })
  it("Should equal to subtraction of smaller number from large number", async() => {
    const input = [20, 9]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] - input[1])))
  })
  it("Should equal to subtraction of larger number from small number", async() => {
    const input = [1, 1000]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] - input[1])))
  })
  it("Should equal to zero", async() => {
    const input = [
      exports.p - Scalar.fromString('1'),
      exports.p - Scalar.fromString('1')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})
describe("0x04 DIV test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "div_test.circom"))
  })
  it("Should equal to zero", async() => {
    const input = [9, 20]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))

  })
  it("Should equal to zero", async() => {
    const input = [0, 1000]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [
      exports.p - Scalar.fromString('1'),
      exports.p - Scalar.fromString('1')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
})

describe("0x05 SDIV test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "sdiv_test.circom"))
  })
  it("Should equal to zero", async() => {
    const input = [9, 20]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to positive two", async() => {
    const input = [20, 9]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(2)))
  })
  it("Should equal to negative two", async() => {
    const input = [
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('7'),
      Scalar.fromString('3')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE - Scalar.fromString('1'))))
  })
  it("Should equal to negative two", async() => {
    const input = [
      Scalar.fromString('7'),
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('3')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE - Scalar.fromString('1'))))
  })
  it("Should equal to positive two", async() => {
    const input = [
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('7'),
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('3')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(2)))
  })
})

describe("0x06 MOD test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "mod_test.circom"))
  })
  it("Should equal to dividend", async() => {
    const input = [9, 20]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), input[0] % input[1]))

  })
  it("Should equal to zero", async() => {
    const input = [0, 1000]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero", async() => {
    const input = [
      exports.p - Scalar.fromString('1'),
      exports.p - Scalar.fromString('1')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x07 SMOD test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "smod_test.circom"))
  })
  it("Should equal to the first input", async() => {
    const input = [9, 20]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0])))
  })
  it("Should equal to positive two", async() => {
    const input = [20, 9]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] % input[1])))
  })
  it("Should equal to negative one", async() => {
    const input = [
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('7'),
      Scalar.fromString('3')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE)))
  })
  it("Should equal to negative one", async() => {
    const input = [
      Scalar.fromString('7'),
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('3')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE)))
  })
  it("Should equal to positive one", async() => {
    const input = [
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('7'),
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('3')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
})

describe("0x08 ADDMOD test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "addmod_test.circom"))
  })
  it("Should equal to modular of summation of first two inputs", async() => {
    const input = [9, 20, 7]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e((input[0] + input[1]) % input[2])))
  })
  it("Should equal to zero", async() => {
    const input = [0, 0, 7]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero", async() => {
    const input = [
      exports.p - Scalar.fromString('1'),
      Scalar.fromString("1"),
      Scalar.fromString("17")
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x09 MULMOD test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "mulmod_test.circom"))
  })
  it("Should equal to modular of multiplication of first two inputs", async() => {
    const input = [9, 20, 7]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e((input[0] * input[1]) % input[2])))
  })
  it("Should equal to zero", async() => {
    const input = [0, 0, 7]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero", async() => {
    const input = [
      exports.p,
      Scalar.fromString("1"),
      Scalar.fromString("17")
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x0A EXP test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "exp_test.circom"))
  })
  it("Should equal to pow(a, b)", async() => {
    const input = {in: 9, n: 5}
    witness = await circuit.calculateWitness(input, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(Math.pow(input["in"], input["n"]))))
  })
  it("Should equal to one", async() => {
    const input = {in: 1, n: 100}
    witness = await circuit.calculateWitness(input, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to one", async() => {
    const input = {in: 17, n: 0}
    witness = await circuit.calculateWitness(input, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = {in: 0, n: 100}
    witness = await circuit.calculateWitness(input, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})
// TODO: 0x0B SINGEXTEND