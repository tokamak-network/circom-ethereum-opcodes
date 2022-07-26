mkdir constraints/$1
circom $1_test.circom --r1cs --json -o constraints/$1 > constraints/$1/$1_info.txt && \
mv constraints/$1/$1_test.r1cs constraints/$1/$1.r1cs
mv constraints/$1/$1_test.json constraints/$1/$1.json
cat constraints/$1/$1_info.txt