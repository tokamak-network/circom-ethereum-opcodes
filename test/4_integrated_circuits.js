const chai = require("chai")
const path = require("path")
const F1Field = require("ffjavascript").F1Field
const Scalar = require("ffjavascript").Scalar
exports.p = Scalar.fromString("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab") // BLS12-381 prime
const Fr = new F1Field(exports.p)
const wasm_tester = require("circom_tester").wasm
const assert = chai.assert
const MAX_VALUE = Scalar.fromString("115792089237316195423570985008687907853269984665640564039457584007913129639935") // 2**256 - 1

describe("0x01 ADD test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to sum of two small inputs", async() => {
    const input = [32, 200, 0]
    const selector = 2**0
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )

    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] + input[1])))
  })
  it("Should equal to sum of two big enough inputs", async() => {
    const input = [
      BigInt(2**252), 
      BigInt(2**252),
      Scalar.fromString("0")
    ]
    const selector = 2**0
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] + input[1])))
  })
  it("Should equal to sum of two big enough inputs", async() => {
    const input = [
      BigInt(2**128),
      BigInt(2**252),
      Scalar.fromString("0")
    ]
    const selector = 2**0
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]),Fr.e(input[0] + input[1])))
  })
})


describe("0x02 MUL test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to product of two small inputs", async() => {
    const input = [20, 9, 0]
    const selector = 2**1
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] * input[1])))
  })
  it("Should equal to product of two big enough inputs", async() => {
    const input = [
      BigInt(2**252),
      BigInt(2**2),
      Scalar.fromString("0")
    ]
    const selector = 2**1
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] * input[1])))
  })
  it("Should equal to zero", async() => {
    const input = [
      BigInt(2*253 - 1),
      Scalar.fromString("0"),
      Scalar.fromString("0")
    ]
    const selector = 2**1
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})


describe("0x03 SUB test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to subtraction of smaller number from large number", async() => {
    const input = [20, 9, 0]
    const selector = 2**2
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] - input[1])))
  })
  it("Should equal to subtraction of larger number from small number", async() => {
    const input = [1, 1000, 0]
    const selector = 2**2
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] - input[1])))
  })
  it("Should equal to zero", async() => {
    const input = [
      BigInt(2**252 - 1),
      BigInt(2**252 - 1),
      Scalar.fromString("0")
    ]
    const selector = 2**2
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})


describe("0x04 DIV test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to zero", async() => {
    const input = [9, 20, 0]
    const selector = 2**3
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))

  })
  it("Should equal to zero", async() => {
    const input = [0, 1000, 0]
    const selector = 2**3
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [
      BigInt(2**252 - 1),
      BigInt(2**252 - 1),
      Scalar.fromString("0")
    ]
    const selector = 2**3
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero; divide by zero", async() => {
    const input = [10, 0, 0]
    const selector = 2**3
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero; divide by zero", async() => {
    const input = [
      BigInt(2**252 - 1),
      Scalar.fromString('0'),
      Scalar.fromString('0')
    ]
    const selector = 2**3
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x05 SDIV test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to zero", async() => {
    const input = [9, 20, 0]
    const selector = 2**4
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to positive two", async() => {
    const input = [20, 9, 0]
    const selector = 2**4
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(2)))
  })
  it("Should equal to negative two", async() => {
    const input = [
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('7'),
      Scalar.fromString('3'),
      Scalar.fromString('0')
    ]
    const selector = 2**4
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE - Scalar.fromString('1'))))
  })
  it("Should equal to negative two", async() => {
    const input = [
      Scalar.fromString('7'),
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('3'),
      Scalar.fromString('0')
    ]
    const selector = 2**4
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE - Scalar.fromString('1'))))
  })
  it("Should equal to positive two", async() => {
    const input = [
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('7'),
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('3'),
      Scalar.fromString('0')
    ]
    const selector = 2**4
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(2)))
  })
  it("Should equal to zero: devide by zero", async() => {
    const input = [100, 0, 0]
    const selector = 2**4
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero: devide by zero", async() => {
    const input = [
      Scalar.fromString('7237005577332262213973186563042994240829374041602535252466099000494570602495'),
      0,
      0
    ]
    const selector = 2**4
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero; divide by zero", async() => {
    const input = [
      MAX_VALUE, // -1
      Scalar.fromString('0'),
      Scalar.fromString('0')
    ]
    const selector = 2**4
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to -2^252", async() => {
    const input = [
      Scalar.fromString('7237005577332262213973186563042994240829374041602535252466099000494570602496'), // -2^252
      MAX_VALUE,
      Scalar.fromString('0')
    ]
    const selector = 2**4
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0])))
  })
})

describe("0x06 MOD test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to dividend", async() => {
    const input = [9, 20, 0]
    const selector = 2**5
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), input[0] % input[1]))

  })
  it("Should equal to zero", async() => {
    const input = [0, 1000, 0]
    const selector = 2**5
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  // 
  it("Should equal to zero", async() => {
    const input = [
      BigInt(2**252 - 1),
      BigInt(2**252 - 1),
      0
    ]
    const selector = 2**5
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero: divide by zero", async() => {
    const input = [1000, 0, 0]
    const selector = 2**5
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero; divide by zero", async() => {
    const input = [
      MAX_VALUE,
      Scalar.fromString('0'),
      Scalar.fromString('0'),
    ]
    const selector = 2**5
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x07 SMOD test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to the first input", async() => {
    const input = [9, 20, 0]
    const selector = 2**6
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0])))
  })
  it("Should equal to positive two", async() => {
    const input = [20, 9, 0]
    const selector = 2**6
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] % input[1])))
  })
  it("Should equal to negative one", async() => {
    const input = [
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('7'),
      Scalar.fromString('3'),
      Scalar.fromString('0')
    ]
    const selector = 2**6
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE)))
  })
  it("Should equal to negative one", async() => {
    const input = [
      Scalar.fromString('7'),
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('3'),
      Scalar.fromString('0')
    ]
    const selector = 2**6
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE)))
  })
  it("Should equal to positive one", async() => {
    const input = [
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('7'),
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('3'),
      Scalar.fromString('0')
    ]
    const selector = 2**6
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero: divide by zero", async() => {
    const input = [1000, 0, 0]
    const selector = 2**6
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero; divide by zero", async() => {
    const input = [
      Scalar.fromString('7237005577332262213973186563042994240829374041602535252466099000494570602495'),
      Scalar.fromString('0'),
      Scalar.fromString('0'),
    ]
    const selector = 2**6
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero; divide by zero", async() => {
    const input = [
      MAX_VALUE, // -1
      Scalar.fromString('0'),
      Scalar.fromString('0'),
    ]
    const selector = 2**6
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x08 ADDMOD test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to modular of summation of first two inputs", async() => {
    const input = [9, 20, 7]
    const selector = 2**7
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e((input[0] + input[1]) % input[2])))
  })
  it("Should equal to zero", async() => {
    const input = [0, 0, 7]
    const selector = 2**7
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero", async() => {
    const input = [
      BigInt(2**252 - 1),
      Scalar.fromString("1"),
      Scalar.fromString("17")
    ]
    const selector = 2**7
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero: divide by zero", async() => {
    const input = [10, 1, 0]
    const selector = 2**7
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero: divide by zero", async() => {
    const input = [
      MAX_VALUE,
      Scalar.fromString('1'),
      Scalar.fromString('0')
    ]
    const selector = 2**7
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x09 MULMOD test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to modular of multiplication of first two inputs", async() => {
    const input = [9, 20, 7]
    const selector = 2**8
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e((input[0] * input[1]) % input[2])))
  })
  it("Should equal to zero", async() => {
    const input = [0, 0, 7]
    const selector = 2**8
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero", async() => {
    const input = [
      0,
      Scalar.fromString("1"),
      Scalar.fromString("17")
    ]
    const selector = 2**8
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero: divide by zero", async() => {
    const input = [10, 1, 0]
    const selector = 2**8
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero: divide by zero", async() => {
    const input = [
      MAX_VALUE,
      Scalar.fromString('2'),
      Scalar.fromString('0')
    ]
    const selector = 2**8
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x0A EXP test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to pow(a, b)", async() => {
    const input = [9, 5, 0]
    const selector = 2**9
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(Math.pow(input[0], input[1]))))
  })
  it("Should equal to one", async() => {
    const input = [1, 100, 0]
    const selector = 2**9
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to one", async() => {
    const input = [17, 0, 0]
    const selector = 2**9
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [0, 100, 0]
    const selector = 2**9
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [0, 0, 0]
    const selector = 2**9
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
})
// 0x0B SINGEXTEND

describe("0x0B SIGNEXTEND test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to signextend", async() => {
    const input = [0, 127, 0]
    const selector = 2**15
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(
      Fr.eq(
        Fr.e(witness[1]), 
        Fr.e(input[1])
      )
    )
  })
  it("Should equal to signextend", async() => {
    const input = [1, 2**15, 0]
    const selector = 2**15
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(
      Fr.eq(
        Fr.e(witness[1]), 
        Fr.e(Fr.e(2**253) - Fr.e(2**16) + Fr.e(input[1]))
      )
    )
  })
  it("Should equal to the original input", async() => {
    const input = [32, 2**15, 0]
    const selector = 2**15
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(
      Fr.eq(
        Fr.e(witness[1]), 
        Fr.e(input[1])
      )
    )
  })
})

describe("0x10 LT test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to one", async() => {
    const input = [1, 200, 0]
    const selector = 2**16
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [200, 1, 0]
    const selector = 2**16
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [
      Scalar.fromString("0"),
      Scalar.fromString("3"),
      Scalar.fromString("0")
    ]
    const selector = 2**16
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
})

describe("0x11 GT test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to zero", async() => {
    const input = [1, 200, 0]
    const selector = 2**17
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [200, 1, 0]
    const selector = 2**17
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [
      Scalar.fromString("0"),
      Scalar.fromString("3"),
      Scalar.fromString("0")
    ]
    const selector = 2**17
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x12 SLT test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to one", async() => {
    const input = [1, 200, 0]
    const selector = 2**18
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [1000, 200, 0]
    const selector = 2**18
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [
      BigInt(2**252),
      Scalar.fromString("100"),
      Scalar.fromString("0")
    ]
    const selector = 2**18
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [
      Scalar.fromString("100"),
      BigInt(2**252),
      Scalar.fromString("0")
    ]
    const selector = 2**18
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [
      MAX_VALUE - Scalar.fromString('5'),
      MAX_VALUE - Scalar.fromString('1'),
      Scalar.fromString("0")
    ]
    const selector = 2**18
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [
      MAX_VALUE - Scalar.fromString('1'),
      MAX_VALUE - Scalar.fromString('5'),
      Scalar.fromString("0")
    ]
    const selector = 2**18
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x13 SGT test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to one", async() => {
    const input = [200, 1, 0]
    const selector = 2**19
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [1, 200, 0]
    const selector = 2**19
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [
      Scalar.fromString("100"),
      BigInt(2**252),
      Scalar.fromString("0")
    ]
    const selector = 2**19
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [
      BigInt(2**252),
      Scalar.fromString("100"),
      Scalar.fromString("0")
    ]
    const selector = 2**19
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [
      MAX_VALUE - Scalar.fromString('1'),
      MAX_VALUE - Scalar.fromString('5'),
      Scalar.fromString("0")
    ]
    const selector = 2**19
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [
      MAX_VALUE - Scalar.fromString('5'),
      MAX_VALUE - Scalar.fromString('1'),
      Scalar.fromString("0")
    ]
    const selector = 2**19
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x14 EQ test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to zero", async() => {
    const input = [1, 200, 0]
    const selector = 2**10
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [200, 200, 0]
    const selector = 2**10
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to one", async() => {
    const input = [
      Scalar.fromString("1"),
      Scalar.fromString("1"),
      Scalar.fromString("0")
    ]
    const selector = 2**10
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
})

describe("0x15 ISZERO test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to zero", async() => {
    const input = [0, 0, 0]
    const selector = 2**11
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to one", async() => {
    const input = [100, 0, 0]
    const selector = 2**11
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero", async() => {
    const input = [0, 0, 0]
    const selector = 2**11
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
})

describe("0x19 NOT test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to one", async() => {
    const input = [
      MAX_VALUE, 
      0, 
      0
    ]
    const selector = 2**20
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero", async() => {
    const input = [
      MAX_VALUE, 
      0, 
      0
    ]
    const selector = 2**20
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x1A BYTE test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to 127", async() => {
    const input = [31, 127, 0]
    const selector = 2**21
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(
      Fr.eq(
        Fr.e(witness[1]), 
        Fr.e(
          (input[1] >> (248 - input[0] * 8)) & 255
        )
      )    
    )
  })
  it("Should equal to 1", async() => {
    const input = [30, 256, 0]
    const selector = 2**21
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(
      Fr.eq(
        Fr.e(witness[1]), 
        Fr.e(1)
      )    
    )
  })
  it("Should equal to 1", async() => {
    const input = [33, 256, 0]
    const selector = 2**21
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(
      Fr.eq(
        Fr.e(witness[1]), 
        Fr.e(0)
      )    
    )
  })
})

describe("0x1B SHL test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to input1 << input2", async() => {
    const input = [3, 4, 0]
    const selector = 2**12
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[1] << input[0])))
  })
  it("Should equal to 2**253", async() => {
    const input = [253, 1, 0]
    const selector = 2**12
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE + Scalar.fromString('1'))))
  })
  it("Should equal to zero", async() => {
    const input = [100, 0, 0]
    const selector = 2**12
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x1C1 SHR-L test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should equal to input1 >> input2", async() => {
    const input = [15, 2, 0]
    const selector = 2**13
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[1] >>> input[0])))
  })
  it("Should equal to zero", async() => {
    const input = [253, MAX_VALUE, 0]
    const selector = 2**13
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero", async() => {
    const input = [100, 0, 0]
    const selector = 2**13
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x1D SAR test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "ic_test.circom"))
  })
  it("Should zero-fill right shift", async() => {
    const input = [15, 2, 0]
    const selector = 2**22
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[1] >>> input[0])))
  })
  it("Should fill signed bit in msb", async() => {
    const input = [Scalar.fromString('2'), MAX_VALUE, 0]
    const selector = 2**22
    witness = await circuit.calculateWitness(
      {
        "in": input, 
        "selector": selector
      }, true
    )
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE)))
  })
})