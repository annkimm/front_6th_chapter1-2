export const createObserver = () => {
  const listeners = new Set<() => void>();
  const subscribe = (fn: () => void) => listeners.add(fn);
  const notify = () => listeners.forEach((listener) => listener());

  return { subscribe, notify };
};
