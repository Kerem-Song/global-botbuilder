import { useEffect } from 'react';

export function useOutsideClick(ref: any, action: () => void) {
  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        action();
      }
    });
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('click', action);
    };
  }, [action, ref]);
}
