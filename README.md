# circom-ethereum-opcodes

Circom circuit set of the Ethereum opcodes

## Goal

Tokamak team is working toward a zk-EVM which is capable to execute EVM bytecode and generate a zk-SNARK proof based on our SNARK paper "[An Efficient SNARK for Field-Programmable and RAM Circuits
](https://eprint.iacr.org/2024/507)".
The original Groth16 requires high cost "setup" for every single transaction since it is a circuit-speicific SNARK. On the other hand, universal SNARKs such as Plonk would be enough with just a single setup but the existing protocols cause humongous computation overhead in proving and verifying algorithm.

Every transaction might execute different functions with different arguments but all the execution steps can be broken down into the EVM opcode set; the executed opcodes should be in the EVM instruction set even though the order of opcode execution would be different.

Our approach is to take advantage of those two different types of SNARK protocols by assembling each EVM opcode circuit in the order of executions by a transaction; it would be fast to prove and verify like circuit-speicific SNARKs and require only a single setup phase similar to universal SNARKs. It is enough to make setups for the EVM opcode circuits, rather than you need setups everytime transaction occurs. This allows us to make all transactions zk-provable after a single of the setup phase, using [Tokamak-ZkEVM](https://github.com/tokamak-network/Tokamak-ZkEVM) without any huge sacrifice in terms of cost to prove or verify.

This repository aims to implement zk-SNARK provable circuits of the EVM instruction set along Tokamak zk-EVM plan.

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

## Circuit design

The circuits are implemented following the instruction definitions in Ethereum yellow paper.

To learn more about Circom, please check [the official document](https://docs.circom.io/).

### Input

The circuits take one or multiple input signals such as "`in1`" or "`in2`".

Due to limitation where the Circom's finite field prime (BN128) is 254-bit sized value, each circuit takes two 128-bit length values to be compatible with 32-byte words.

Signed integers are represented as two's complements.

### Output

All the opcode circuits return a single output except `load` for a special use.

The circuits returns two 128-bit values as output signals.

### Number of constraints per opcode
|Arithmetic Opcode|0x01 ADD|0x02 MUL|0x03 SUB|0x04 DIV|0x05 SDIV|0x06 MOD|0x07 SMOD|0x08 ADDMOD|0x09 MULMOD|0x0A EXP|0x0B SIGNEXTEND|
|---|---|---|---|---|---|---|---|---|---|---|---|
|Constraints|256|522|256|1054|*4155|1054|*4155|*1445|*2239|🚧 WIP|*2823|

|Comparators Opcode|0x10 LT|0x11 GT|0x12 SLT|0x13 SGT|0x14 EQ|0x15 ISZERO|
|---|---|---|---|---|---|---|
|Constraints|262|262|520|520|5|5|

|Bitwise Opcode|0x16 AND|0x17 OR|0x18 XOR|0x19 NOT|0x1A BYTE|0x1B SHL|0x1C SHR|0x1D SAR|
|---|---|---|---|---|---|---|---|---|
|Constraints|768|768|768|256|308|326|325|1063

*: Improvement is required to be used in products.

Most Cost is the range check cost. For future research on optimization, please check [Further Research](#further-research) below.

### Our SNARK Primitive - Subcircuit library
Refer to [our SNARK paper](https://eprint.iacr.org/2024/507.pdf) "3 Front-end preprocess: System of constraints and setup algorithm"

### Our Limitation
- EXP

    As the exponent range is [0,2**256), if an EXP circuit is implemented, it will be the most expensive among the above opcodes. In other words, including an EXP single circuit in the subcircuit library has the disadvantage of being expensive. One good approach is to implement the EXP operation using the MUL opcode circuit already in the subcircuit library.

- SHA3

    [Keccak256](https://github.com/vocdoni/keccak256-circom) hash function is implemented in Circom by [Vocdoni](https://github.com/vocdoni). However, it needs around 151k constraints by Keccak's zk-unfriendliness. It is too expensive to put it in a subcircuit library.


## Further Research

How to reduce range check constraints

- About R1CS range check : [Simple R1CS range check and truncation](https://hackmd.io/@7dpNYqjKQGeYC7wMlPxHtQ/B1w_9nq2Y)

Can we Use Lookup?

- [GroLup: Plookup for R1CS](https://ethresear.ch/t/grolup-plookup-for-r1cs/14307)

- [Can Groth16 support lookups?](https://hackmd.io/@Merlin404/SJmtF_k-2)

Optimize our zk-EVM Subcircuit library

- Splitting opcode operations. (e.g. SDIV => sign_bit extraction circuit + subcircuit already in subcircuit library)
    - [Using lazy loading for duplicate subcircuit constraints](https://hackmd.io/@JIJKVPoYSZaHxu42ObOitQ/SJDZWE-Gh)
- Combine opposing opcodes into one subcircuit. (e.g. <0x10 LT, 0x11 GT>,<0x12 SLT, 0x13 SGT>)