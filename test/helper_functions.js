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

module.exports = {
  construct256BitInteger,
  split256BitInteger,
  sar256BitInteger,
};