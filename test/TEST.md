# Test

You can compile all the circuits implemented in `@/circuits` by the following command.

```Bash
$> cd test/circuits
$> ./compile
```

This produces constraints(.json, .r1cs) in `test/circuits/constraints`, witness generator(.wasm) in `test/circuits/wasm` and `circuits/subcircuit-list.json`.

Moreover, you can run mocha test files.
