export function bSpline(t1, v0, v1, v2, v3) {
  let t2 = t1 * t1, t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0
    + (4 - 6 * t2 + 3 * t3) * v1
    + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
    + t3 * v3) / 6;
}
