/**
 * Analytic Hierarchy Process (AHP) — Saaty, 1980.
 *
 * A pairwise comparison matrix A (n×n) holds a_ij = how much more important
 * criterion i is than criterion j on Saaty's 1–9 scale, with a_ji = 1 / a_ij.
 * The priority (weight) vector is the normalised principal eigenvector of A.
 * Consistency is checked with CR = CI / RI where CI = (λmax − n) / (n − 1);
 * a CR below 0.10 is considered acceptable.
 */

export type PairwiseMatrix = number[][];

export interface AhpResult {
  weights: number[];
  lambdaMax: number;
  consistencyIndex: number;
  consistencyRatio: number;
  isConsistent: boolean;
}

/** Saaty's Random Index for matrices of order n (index = n). */
const RANDOM_INDEX = [0, 0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];

export const CONSISTENCY_THRESHOLD = 0.1;

/**
 * Build a full reciprocal matrix from the upper triangle.
 * `upper[i]` lists the judgements a_i,(i+1) … a_i,(n-1).
 */
export function fromUpperTriangle(upper: number[][]): PairwiseMatrix {
  const n = upper.length + 1;
  const m: PairwiseMatrix = Array.from({ length: n }, () => Array(n).fill(1));
  for (let i = 0; i < n - 1; i++) {
    if (upper[i].length !== n - 1 - i) {
      throw new Error(`AHP: row ${i} needs ${n - 1 - i} judgements, got ${upper[i].length}`);
    }
    upper[i].forEach((value, k) => {
      const j = i + 1 + k;
      if (value <= 0) throw new Error("AHP: judgements must be positive");
      m[i][j] = value;
      m[j][i] = 1 / value;
    });
  }
  return m;
}

function assertReciprocal(matrix: PairwiseMatrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    if (matrix[i].length !== n) throw new Error("AHP: matrix must be square");
    if (Math.abs(matrix[i][i] - 1) > 1e-9) throw new Error("AHP: diagonal must be 1");
    for (let j = 0; j < n; j++) {
      if (Math.abs(matrix[i][j] * matrix[j][i] - 1) > 1e-6) {
        throw new Error(`AHP: matrix is not reciprocal at (${i}, ${j})`);
      }
    }
  }
}

/** Compute AHP priorities using power iteration on the principal eigenvector. */
export function computeAhp(matrix: PairwiseMatrix, iterations = 100): AhpResult {
  assertReciprocal(matrix);
  const n = matrix.length;
  if (n === 1) {
    return { weights: [1], lambdaMax: 1, consistencyIndex: 0, consistencyRatio: 0, isConsistent: true };
  }

  let w = Array(n).fill(1 / n);
  for (let iter = 0; iter < iterations; iter++) {
    const next = matrix.map((row) => row.reduce((sum, a, j) => sum + a * w[j], 0));
    const total = next.reduce((a, b) => a + b, 0);
    const normalised = next.map((v) => v / total);
    const delta = normalised.reduce((d, v, i) => Math.max(d, Math.abs(v - w[i])), 0);
    w = normalised;
    if (delta < 1e-12) break;
  }

  // λmax = mean of (A·w)_i / w_i
  const aw = matrix.map((row) => row.reduce((sum, a, j) => sum + a * w[j], 0));
  const lambdaMax = aw.reduce((sum, v, i) => sum + v / w[i], 0) / n;
  const consistencyIndex = (lambdaMax - n) / (n - 1);
  const ri = RANDOM_INDEX[n] ?? 1.49;
  const consistencyRatio = ri === 0 ? 0 : consistencyIndex / ri;

  return {
    weights: w,
    lambdaMax,
    consistencyIndex,
    consistencyRatio,
    isConsistent: consistencyRatio < CONSISTENCY_THRESHOLD,
  };
}

/** Weighted sum Σ wᵢ·sᵢ — scores and weights must be in the same order. */
export function weightedScore(weights: number[], scores: number[]): number {
  if (weights.length !== scores.length) throw new Error("AHP: weights/scores length mismatch");
  return weights.reduce((sum, w, i) => sum + w * scores[i], 0);
}
