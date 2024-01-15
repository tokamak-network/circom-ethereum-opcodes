# circom-ethereum-opcodes

Circom circuit set of the Ethereum opcodes

## Goal

Onther team is working toward a zk-EVM which is capable to execute EVM bytecode and generate a zk-SNARK proof based on [the modified Groth16](https://github.com/Onther-Tech/UniGro16js).
The original Groth16 requires high cost "setup" for every single transaction since it is a circuit-speicific SNARK. On the other hand, universal SNARKs such as Plonk would be enough with just a single setup but the existing protocols cause humongous computation overhead in proving and verifying algorithm.

Every transaction might execute different functions with different arguments but all the execution steps can be broken down into the EVM opcode set; the executed opcodes should be in the EVM instruction set even though the order of opcode execution would be different.

Our approach is to take advantage of those two different types of SNARK protocols by assembling each EVM opcode circuit in the order of executions by a transaction; it would be fast to prove and verify like circuit-speicific SNARKs and require only a single setup phase similar to universal SNARKs. It is enough to make setups for the EVM opcode circuits, rather than you need setups everytime transaction occurs. This allows us to make all transactions zk-provable after a single of the setup phase, using [the modified Groth16](https://github.com/Onther-Tech/UniGro16js) without any huge sacrifice in terms of cost to prove or verify.

This repository aims to implement zk-SNARK provable circuits of the EVM instruction set along Onther's zk-EVM plan.

## Directory tree

```text
circuits
├── templates
│   ├── 128bit
│   │   ├── adder.circom
│   │   ├── divider.circom
│   │   ├── exp.circom
│   │   └── multiplier.circom
│   ├── arithmetic_func.circom
│   ├── bit_extractor.circom
│   ├── comparators.circom
│   ├── divider.circom
│   └── two_to_the_power_of_n.circom
├── integrated_circuits
│   ├── alu.circom
│   ├── mlu.circom
│   └── selector_integrity_check.circom
├── add.circom
├── addmod.circom
├── and.circom
├── byte.circom
├── div.circom
├── eq.circom
├── exp.circom
├── gt.circom
├── iszero.circom
├── load.circom
├── lt.circom
├── mod.circom
├── mul.circom
├── mulmod.circom
├── not.circom
├── or.circom
├── sar.circom
├── sdiv.circom
├── sgt.circom
├── sha3.circom
├── shl.circom
├── shr.circom
├── signextend.circom
├── slt.circom
├── smod.circom
├── sub.circom
└── xor.circom
```

- `templates`: The set of circuits and functions frequently used by the sub-circuits. The circuits under `128bit` assume to take 128-bit length values.

- `integrated_circuits`: The subcircuits are consolidated into two circuits (`alu` and `mlu`).

## Circuit design

The circuits are implemented following the instruction definitions in Ethereum yellow paper.

To learn more about Circom, please check [the official document](https://docs.circom.io/).

### Input

The circuits take one or multiple input signals such as "`in1`" or "`in2`".

Due to limitation where the Circom's finite field prime (BN128) is 254-bit sized value, each circuit takes two 128-bit length values to be compatible with 32-byte words.

Signed integers are represented as two's complements.

### Output

All the circuits return a single output except `load` for a special use.

The circuits returns two 128-bit values as output signals.

### ALU and MLU

The Arithmetic Logic Unit (ALU) and Mixed Logic Unit (MLU) are circuits that integrate several sub-circuits. They require an additional input signal called `selector` to choose which circuit will return the output signals. The ALU simply accumulates circuits, while the MLU minimizes constraints by collapsing duplicate circuit logics.

### Limitation

- SHA3

    [Keccak256](https://github.com/vocdoni/keccak256-circom) hash function is implemented in Circom by [Vocdoni](https://github.com/vocdoni). However, it needs around 151k constraints by Keccak's zk-unfriendliness. Regarding no circuit has more than 1k constraints, Keccak circuit requires too much cost. We rather verify Keccak function in the verification phase of the modified Groth16.