# circom-ethereum-opcodes

Circom circuit set of the Ethereum opcodes

## Goal

Onther team is working toward a zk-EVM which is capable to execute EVM bytecode and generate a zk-SNARK proof based on [the modified Groth16](https://github.com/Onther-Tech/UniGro16js).
The original Groth16 requires high cost "setup" for every single transaction since it is a circuit-speicific SNARK. On the other hand, universal SNARKs such as Plonk would be enough with just a single setup but the existing protocols have humongous computation overhead in proving and verifying algorithm.

Every transaction might execute different functions with different arguments but all the execution steps can be broken down into the EVM opcode set; the executed opcodes should be in the EVM instruction set even though the order of opcode execution would be different.

Our approach is to take advantage of those two types of SNARK protocols by assembling each EVM opcode circuit in the order of executions by a transaction; it would be fast to prove and verify like circuit-speicific SNARKs and require only a single setup phase similar to universal SNARKs. It is enough to make setups for the EVM opcode circuits, rather than you need setups everytime transaction occurs. This allows us to make all transactions zk-provable after a single of the setup phase, using [the modified Groth16](https://github.com/Onther-Tech/UniGro16js) without any huge sacrifice in terms of cost to prove or verify.

This repository aims to implement zk-SNARK provable circuits of the EVM instruction set along Onther's zk-EVM plan.

## Directory tree

```text
.
├── README.md
├── circuits
│   ├── add.circom
│   ├── addmod.circom
│   ├── and.circom
│   ├── div.circom
│   ├── eq.circom
│   ├── exp.circom
│   ├── gt.circom
│   ├── iszero.circom
│   ├── load.circom
│   ├── lt.circom
│   ├── mod.circom
│   ├── mul.circom
│   ├── mulmod.circom
│   ├── not.circom
│   ├── or.circom
│   ├── sar.circom
│   ├── sdiv.circom
│   ├── sgt.circom
│   ├── sha3.circom
│   ├── shl.circom
│   ├── shr.circom
│   ├── shr_l.circom
│   ├── shr_r.circom
│   ├── slt.circom
│   ├── smod.circom
│   ├── sub.circom
│   ├── wire-list.json
│   └── xor.circom
├── package-lock.json
├── package.json
└── test
    ├── 0_special.js
    ├── 1_arithmetic_op.js
    ├── 2_comparators.js
    ├── 3_bitwise_op.js
    └── circuits/
```

## Circuit design

The circuits are implemented following the instruction definitions in Ethereum yellow paper.

To learn more about Circom, please check [the official document](https://docs.circom.io/).

### Input

The circuits take one or multiple input signals called "`in`". An unary operator circuit takes "`in`" as a number, otherwise as an array.

Input values should be 253-bit integers since Circom's finite field prime is 254-bit sized value; the finite field does not perform operators over any values greater than the prime number. Therefore we decided to set input signals as 253-bit size to execute operators with the input signals themselves, otherwise input values to circuit are remainders of them divided by the prime number.

Signed integers are represented as two's complement form.

### Output

All the circuits return a single output except `load` for a special use.

The output modulo the Circom prime might not the expected result if any intermediate or final result is greater than the prime number since the operators are performed over the finite field.

### Limitation

There are a few limitations on our very first circuits.

1. Integer incompability to EVM

    The circuits should take 253-bit integers to work as expected, however, EVM computes over 256-bit integers. We will figure it out to improve compatibility to EVM.

2. DIV, MOD, SDIV, SMOD, ADDMOD, MULMOD

    The four circuits work fine but they are not carrying out the exception case such as they should return 0 if divisor is zero stated in Ethereum yellow paper.

3. SHA3

    [Keccak256](https://github.com/vocdoni/keccak256-circom) hash function is implemented in Circom by [Vocdoni](https://github.com/vocdoni). However, it needs around 151k constraints by Keccak's zk-unfriendliness. Regarding no circuit has more than 1k constraints, Keccak circuit requires too much cost. We rather verify Keccak function in the verification phase of the modified Groth16.
