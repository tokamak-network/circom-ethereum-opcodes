pragma circom 2.1.6;
include "128bit/exp.circom";
include "128bit/divider.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";

template _GetBitByIndex () {
  signal input in, index;

  signal exp <== Exp128()([2, index - 1]);
  component divider1 = Divider128();
  divider1.in <== [in, exp];

  component divider2 = Divider128();
  divider2.in <== [divider1.q, 2];

  signal output out <== divider2.r;
}

template GetBitByIndex () { // index 0 ~ 255; 0 is the least significant bit
  signal input in[2], index;

  component divider = Divider128();
  divider.in <== [index, 128];

  signal selector <== IsZero()(divider.q);
  signal _index <== divider.r;

  signal lower_part_bit <== _GetBitByIndex()(in[0], _index);
  signal higher_part_bit <== _GetBitByIndex()(in[1], _index);

  signal output out <== higher_part_bit + selector * (lower_part_bit - higher_part_bit);
}