import { useEffect } from 'react';

export function useContextMenuOutsideClick(ref: any, action: () => void) {
  useEffect(() => {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (ref.current && !ref.current.contains(e.target)) {
        action();
      }
    });
    return () => {
      document.removeEventListener('contextmenu', action);
    };
  }, [action, ref]);
}
