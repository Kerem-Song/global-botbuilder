import { useEffect } from 'react';

export function useContextMenuOutsideClick(ref: any, action: () => void) {
  useEffect(() => {
    document.addEventListener('contextmenu', (e) => {
      console.log('@@useContextMenuOutsideClick', ref.current, e.target);
      e.preventDefault();
      if (ref.current && !ref.current.contains(e.target)) {
        console.log('@useContextMenuOutsideClick different contextmenu:', ref.current);
        action();
      }
    });
    return () => {
      document.removeEventListener('contextmenu', action);
    };
  }, [action, ref]);
}
