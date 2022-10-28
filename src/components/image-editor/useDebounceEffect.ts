import { DependencyList, useEffect } from 'react';

export function useDebounceEffect(
  fn: (deps: DependencyList | undefined) => void,
  waitTime: number,
  deps?: DependencyList,
) {
  useEffect(() => {
    const t = setTimeout(() => {
      // fn.apply(undefined, deps);
      fn(deps);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, deps);
}
