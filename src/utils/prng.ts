/**
 * Mulberry32 is a 32-bit pseudo-random number generator with a period of ~2^32.
 * It produces high-quality statistical distribution, is fast, and provides
 * deterministic results across platforms when initialized with a seed.
 */

// 32-bit FNV-1a hash to convert string seeds to 32-bit unsigned integers
export function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function normalizeSeed(seed: number | string): number {
  if (typeof seed === "number") {
    if (!Number.isFinite(seed)) return 1;
    return (seed >>> 0) || 1;
  }
  if (typeof seed === "string") {
    const trimmed = seed.trim();
    if (/^-?\d+$/.test(trimmed)) {
      const num = parseInt(trimmed, 10);
      return (num >>> 0) || 1;
    }
    return hashSeed(trimmed) || 1;
  }
  return 1;
}

export function generateRandomSeed(): number {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] || 1;
  }
  return ((Math.random() * 0xffffffff) >>> 0) || 1;
}

export type PRNG = {
  next(): number;
  nextInt(min: number, max: number): number;
  getSeed(): number | string;
  reset(seed?: number | string): void;
};

export function createPRNG(
  initialSeed: number | string = generateRandomSeed(),
): PRNG {
  let originalSeed = initialSeed;
  let state = normalizeSeed(initialSeed);

  function next(): number {
    let t = (state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function nextInt(min: number, max: number): number {
    const floorMin = Math.floor(min);
    const floorMax = Math.floor(max);
    if (floorMin > floorMax) {
      throw new Error(`min (${floorMin}) cannot be greater than max (${floorMax})`);
    }
    const range = floorMax - floorMin + 1;
    return floorMin + Math.floor(next() * range);
  }

  return {
    next,
    nextInt,
    getSeed: () => originalSeed,
    reset: (newSeed?: number | string) => {
      if (newSeed !== undefined) {
        originalSeed = newSeed;
      }
      state = normalizeSeed(originalSeed);
    },
  };
}

// Global default PRNG instance used by default dice rolling
let defaultPRNG = createPRNG();

export function setSeed(seed: number | string): void {
  defaultPRNG = createPRNG(seed);
}

export function getSeed(): number | string {
  return defaultPRNG.getSeed();
}

export function resetPRNG(seed?: number | string): void {
  defaultPRNG.reset(seed);
}

export function random(): number {
  return defaultPRNG.next();
}

export function randomInt(min: number, max: number): number {
  return defaultPRNG.nextInt(min, max);
}
