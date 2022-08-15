const chai = require("chai")
const path = require("path")
const F1Field = require("ffjavascript").F1Field
const Scalar = require("ffjavascript").Scalar
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617")
const Fr = new F1Field(exports.p)
const wasm_tester = require("circom_tester").wasm
const assert = chai.assert

describe("0x00 BASE test", function ()  {
  let circuit;
  let witness;
  const NUM_INPUTS = 32
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "base_test.circom"))
  })
  it("Should equal to each input and output array element", async() => {
    const input = Array.from(Array(NUM_INPUTS).keys())
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    for (var i = 0; i < NUM_INPUTS; i++){
      assert(Fr.eq(Fr.e(witness[i + 1]), Fr.e(input[i])))
    }
  })
})