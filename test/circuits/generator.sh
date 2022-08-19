# mkdir constraints/$1
# circom $1_test.circom --r1cs --json --wasm -o constraints/$1 > constraints/$1/$1_info.txt && \
circom $1_test.circom --wasm -o wasm && \
mv wasm/$1_test_js wasm/$1
cp wasm/$1/$1_test.wasm wasm/Subcircuit$2.wasm
# mv constraints/$1/$1_test.r1cs constraints/$1/$1.r1cs
# mv constraints/$1/$1_test_constraints.json constraints/$1/$1_constraints.json