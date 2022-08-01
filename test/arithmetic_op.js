const { throws } = require("assert")
const { expect } = require("chai")
const chai = require("chai")
const { freemem } = require("os")
const path = require("path")
const F1Field = require("ffjavascript").F1Field
const Scalar = require("ffjavascript").Scalar
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617")
const Fr = new F1Field(exports.p)

const wasm_tester = require("circom_tester").wasm

const assert = chai.assert

describe("0x01 Add test", function ()  {
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
    const input = [14474011154664524427946373126085988481658748083205070504932198000989141204992, 14474011154664524427946373126085988481658748083205070504932198000989141204992]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] + input[1])))
  })
  it("Should equal to zero", async() => {
    const input = [Scalar.fromString("1"), Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495616")] // 1, p - 1는 값이 너무 커서 값이 제대로 안 나옴.
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] + input[1])))
  })
})


describe("0x02 Mul test", function ()  {
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
    const input = [14474011154664524427946373126085988481658748083205070504932198000989141204992, 81221]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] * input[1])))
  })
  it("Should equal to zero", async() => {
    const input = [21888242871839275222246405745257275088548364400416034343698204186575808495616, 0]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})
describe("0x03 Sub test", function ()  {
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
    const input = [21888242871839275222246405745257275088548364400416034343698204186575808495616, 21888242871839275222246405745257275088548364400416034343698204186575808495616]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})
describe("0x04 Div test", function ()  {
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
    const input = [21888242871839275222246405745257275088548364400416034343698204186575808495616, 21888242871839275222246405745257275088548364400416034343698204186575808495616]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
})

// TODO: 0x05 SDIV

// TODO: 0x06 MOD

// TODO: 0x07 SMOD

// TODO: 0x08 ADDMOD

// TODO: 0x09 MULMOD

// TODO: 0x0A EXP

// TODO: 0x0B SINGEXTEND