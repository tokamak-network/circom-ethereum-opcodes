names=("load" "add" "mul" "sub" "div" "sha3" "sdiv" "mod" "smod" "addmod" "mulmod" "exp" "lt" "gt" "slt" "sgt" "eq" "iszero" "and" "or" "xor" "not" "shl" "shr_l" "shr_h" "sar" "signextend" "byte")

for (( i = 0 ; i < ${#names[@]} ; i++ )) ; do
  echo "id[$i] = ${names[$i]}" >> temp.txt
  if [ ! -d constraints/${names[$i]} ]
  then
    mkdir constraints/${names[$i]}
  fi
  circom ${names[$i]}_test.circom --r1cs --json -o constraints/${names[$i]} > constraints/${names[$i]}/${names[$i]}_info.txt && \
  cat constraints/${names[$i]}/${names[$i]}_info.txt >> temp.txt
  mv constraints/${names[$i]}/${names[$i]}_test.r1cs constraints/${names[$i]}/${names[$i]}.r1cs
  mv constraints/${names[$i]}/${names[$i]}_test_constraints.json constraints/${names[$i]}/${names[$i]}_constraints.json && \
  cp constraints/${names[$i]}/${names[$i]}.r1cs constraints/subcircuit$i.r1cs

  rm -rf wasm/${names[$i]}
  circom ${names[$i]}_test.circom --wasm -o wasm && \
  mv wasm/${names[$i]}_test_js wasm/${names[$i]} && \
  cp wasm/${names[$i]}/${names[$i]}_test.wasm wasm/subcircuit$i.wasm
done
node parse.js
rm temp.txt