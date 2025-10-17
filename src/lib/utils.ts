export type DebouncedFn<T> = ((v: T) => void) & { cancel?: () => void };

export function debounce<T>(fn: (v: T) => void, wait = 250): DebouncedFn<T> {
  let t: ReturnType<typeof setTimeout> | undefined;
  const debounced = (v: T) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(v), wait);
  };
  debounced.cancel = () => {
    if (t) {
      clearTimeout(t);
      t = undefined;
    }
  };
  return debounced;
}

export function stableSort<T>(arr: T[], compare: (a: T, b: T) => number) {
  return arr
    .map((v, i) => ({ v, i }))
    .sort((a, b) => {
      const r = compare(a.v, b.v);
      return r !== 0 ? r : a.i - b.i;
    })
    .map((x) => x.v);
}
