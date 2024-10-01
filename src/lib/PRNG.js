// src/lib/PRNG.js

export function SeededRandom(seed) {
  // Initialize the state with the seed
  let state = seed >>> 0; // Ensure it's a 32-bit unsigned integer

  return function () {
    // Xorshift32 algorithm
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296; // Convert to a float between 0 (inclusive) and 1 (exclusive)
  };
}