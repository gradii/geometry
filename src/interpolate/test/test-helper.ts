export function expectObjectEqual(obj1, obj2) {
  const k1 = Object.keys(obj1).sort();
  const k2 = Object.keys(obj2).sort();
  expect(k1).toEqual(k2);
  for (let k of k2) {
    const type = typeof Reflect.get(k2, k);
    if (type === 'string') {
      expect(`${Reflect.get(k1, k)}`).toBe(Reflect.get(k2, k));
    } else if (type === 'number') {
      expect(+Reflect.get(k1, k)).toBe(Reflect.get(k2, k));
    } else {
      expect(Reflect.get(k1, k)).toEqual(Reflect.get(k2, k));
    }
  }
}
