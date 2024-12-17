names=("KeccakBufferOut" "Load" "ReturnBuffer" "ADD" "MUL" "SUB" "DIV" "SDIV" "MOD" "SMOD" "ADDMOD" "MULMOD" "EQ" "ISZERO" "SHL" "SHR" "LT" "GT" "NOT" "BYTE" "SAR" "SIGNEXTEND" "SLT" "SGT" "AND" "OR" "XOR" "DecToBit" "SubEXP" "KeccakBufferIn")
CURVE_NAME="bn128"

# get the directory of the script
script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" && \
cd "$script_dir"

test_circuit_dir_path="../test/circuits"
output_dir_path="../outputs"

# emtpy the output directory
rm -rf ${output_dir_path}/*


for (( i = 0 ; i < ${#names[@]} ; i++ )) ; do
  echo "id[$i] = ${names[$i]}" >> temp.txt && \
  mkdir -p ${output_dir_path}/constraints/${names[$i]} && \
  mkdir -p ${output_dir_path}/wasm


  circom ${test_circuit_dir_path}/${names[$i]}_test.circom --r1cs --json -o ${output_dir_path}/constraints/${names[$i]} -p $CURVE_NAME | tee ${output_dir_path}/constraints/${names[$i]}/${names[$i]}_info.txt && \
  cat ${output_dir_path}/constraints/${names[$i]}/${names[$i]}_info.txt >> temp.txt && \
  mv  ${output_dir_path}/constraints/${names[$i]}/${names[$i]}_test.r1cs              ${output_dir_path}/constraints/${names[$i]}/${names[$i]}.r1cs && \
  mv  ${output_dir_path}/constraints/${names[$i]}/${names[$i]}_test_constraints.json  ${output_dir_path}/constraints/${names[$i]}/${names[$i]}_constraints.json && \
  cp  ${output_dir_path}/constraints/${names[$i]}/${names[$i]}.r1cs                   ${output_dir_path}/constraints/subcircuit$i.r1cs

  circom ${test_circuit_dir_path}/${names[$i]}_test.circom --wasm -o ${output_dir_path}/wasm && \
  mv ${output_dir_path}/wasm/${names[$i]}_test_js                 ${output_dir_path}/wasm/${names[$i]} && \
  cp ${output_dir_path}/wasm/${names[$i]}/${names[$i]}_test.wasm  ${output_dir_path}/wasm/subcircuit$i.wasm
done

node parse.js
rm temp.txt