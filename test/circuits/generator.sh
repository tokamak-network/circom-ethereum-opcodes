# mkdir constraints/$1
# circom $1_test.circom --r1cs --json --wasm -o constraints/$1 > constraints/$1/$1_info.txt && \
# circom $1_test.circom --wasm -o wasm && \
# mv wasm/$1_test_js wasm/$1
# cp wasm/$1/$1_test.wasm wasm/Subcircuit$2.wasm
# mv constraints/$1/$1_test.r1cs constraints/$1/$1.r1cs
# mv constraints/$1/$1_test_constraints.json constraints/$1/$1_constraints.json

names=("load" "add" "mul" "sub" "div" "sdiv" "mod" "smod" "addmod" "mulmod" "exp" "lt" "gt" "slt" "sgt" "eq" "iszero" "and" "or" "xor" "not" "shl" "shr_l" "shr_r" "sar")

for (( i = 0 ; i < ${#names[@]} ; i++ )) ; do
  echo "id[$i] = ${names[$i]}"
  if [ ! -d constraints/${names[$i]} ]
  then
    mkdir constraints/${names[$i]}
  fi
  circom ${names[$i]}_test.circom --r1cs --json -o constraints/${names[$i]} > constraints/${names[$i]}/${names[$i]}_info.txt && \
  mv constraints/${names[$i]}/${names[$i]}_test.r1cs constraints/${names[$i]}/${names[$i]}.r1cs
  mv constraints/${names[$i]}/${names[$i]}_test_constraints.json constraints/${names[$i]}/${names[$i]}_constraints.json && \
  cp constraints/${names[$i]}/${names[$i]}.r1cs constraints/subcircuit$i.r1cs

  rm -rf wasm/${names[$i]}
  circom ${names[$i]}_test.circom --wasm -o wasm && \
  mv wasm/${names[$i]}_test_js wasm/${names[$i]} && \
  cp wasm/${names[$i]}/${names[$i]}_test.wasm wasm/subcircuit$i.wasm
done