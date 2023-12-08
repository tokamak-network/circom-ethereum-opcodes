pragma circom 2.1.6;
include "comparators.circom";
include "128bit/exp.circom";
include "128bit/divider.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";

template _GetBitByIndex () {
  signal input in, pos;

  //(in >> pos) & 1 == (in // 2**pos) % 2
  signal exp <== Exp128()([2, pos]);
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
  signal pos <== divider.r;

  signal lower_part_bit <== _GetBitByIndex()(in[0], pos);
  signal higher_part_bit <== _GetBitByIndex()(in[1], pos);

  signal output out <== higher_part_bit + selector * (lower_part_bit - higher_part_bit);
}

// slice a given bit string by pos
// output can be described as pos[0:pos] and pos[pos:256] in pythonic way
// for example, pos  = 128, then the first 128 bits are in[0], the last 128 bits are in[1]
template SliceBitStr () {
  signal input in[2], pos;

  signal is_less_than_128 <== IsLessThanN128()(pos, 128);
  signal is_less_than_256 <== IsLessThanN128()(pos, 256);

  signal lower_exp <== Exp128()([2, pos]);
  signal higher_exp <== Exp128()([2, pos - 128]);

  component divider1 = Divider128();
  divider1.in <== [in[0], lower_exp];

  component divider2 = Divider128();
  divider2.in <== [in[1], higher_exp];

  signal lower_part <== divider1.r;
  signal higher_part <== divider2.r;

  signal output out[2];
  out[0] <== in[0] + is_less_than_128 * (lower_part - in[0]);

  signal temp <== (in[1] + is_less_than_256 * (higher_part - in[1]));
  out[1] <== (1 - is_less_than_128) * temp;
}