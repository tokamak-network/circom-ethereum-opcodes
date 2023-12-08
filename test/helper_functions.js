function construct256BitInteger(parts) {
  // Ensure the input array has exactly two elements
  if (parts.length !== 2) {
    throw new Error('Input array must contain exactly two elements.');
  }

  // Convert each part to BigInt
  const part1 = BigInt(parts[0]);
  const part2 = BigInt(parts[1]);

  // Construct the 256-bit integer
  let result = part1 + (part2 << BigInt(128));

  // Perform modular operation on 2^256
  result %= 2n ** 256n;

  return result;
}

function split256BitInteger(value) {
  if (typeof value !== 'bigint') {
    value = BigInt(value);
  }

  // Calculate the lower and upper parts
  const lower = (value & ((1n << 128n) - 1n)) % 2n ** 128n;
  const upper = (value >> 128n) % 2n ** 128n;

  return [lower, upper];
}

function sar256BitInteger(value, shiftAmount) {
  if (typeof value !== 'bigint') {
    value = BigInt(value);
  }
  if (typeof shiftAmount !== 'bigint') {
    shiftAmount = BigInt(shiftAmount);
  }

  // Extract the original sign bit (256th bit)
  const signBit = value & (1n << 255n);

  // Perform SAR operation manually
  let result;
  if (signBit === 0n) {
    // If the original value is non-negative, perform a regular right shift
    result = value >> shiftAmount;
  } else {
    // If the original value is negative, manually set the leftmost bits to 1 after shifting
    const shiftedValue = value >> shiftAmount;
    const supplied = ((2n ** shiftAmount) - 1n) << (256n - shiftAmount);
    result = shiftedValue + supplied;
  }

  return result % (2n ** 256n);
}

function signedLessThan256BitInteger(a, b) {
  if (typeof a !== 'bigint') {
    a = BigInt(a);
  }
  if (typeof b !== 'bigint') {
    b = BigInt(b);
  }

  // Extract the sign bits (256th bits)
  const signBitA = a & (1n << 255n);
  const signBitB = b & (1n << 255n);

  if (signBitA !== signBitB) {
    // If sign bits are different, return true if a is negative, false otherwise
    return signBitA !== 0n;
  } else {
    // If sign bits are the same, perform a regular comparison
    return a < b;
  }
}

function getByte(byteIndex, value) {
  if (typeof value !== 'bigint') {
    value = BigInt(value);
  }
  if (typeof byteIndex !== 'bigint') {
    byteIndex = BigInt(byteIndex);
  }

  // Ensure byteIndex is within 0-31
  if (byteIndex < 0n || byteIndex > 31n) {
    return BigInt(0);
  }

  // Extract the byte
  return (value >> (8n * (31n - byteIndex))) % 2n ** 8n;
}

function signExtend (index, value) {
  if (typeof index !== 'bigint') {
    index = BigInt(index);
  }
  if (typeof value !== 'bigint') {
    value = BigInt(value);
  }

  // Calculate the sign bit position
  const signBitPos = 8n * (index + 1n);

  let res;

  // Check if the sign bit is set
  if ((value & (1n << (signBitPos - 1n))) !== 0n) {
    // If set, perform sign extension
    const extensionBits = 256n - signBitPos;
    const extensionMask = (1n << extensionBits) - 1n;
    return value | (extensionMask << signBitPos);
  }
  // If sign bit is not set, return the original value
  return value & ((1n << signBitPos) - 1n);
}

module.exports = {
  construct256BitInteger,
  split256BitInteger,
  sar256BitInteger,
  signedLessThan256BitInteger,
  getByte,
  signExtend,
};