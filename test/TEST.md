# Test

You can compile all the circuits implemented in `@/circuits` by the following command.

```Bash
$> ./scripts/compile.sh
```

This will generate constraints(.json, .r1cs) under `outputs/constraints`, witness generator(.wasm) in `outputs/wasm` and `outputs/subcircuit-list.json`.

Moreover, you can run mocha test files by running the following commands.

```Bash
$> mocha test
$> mocha test/1_arithmetic_op.js
```
