import { useEffect } from 'react';

export function useOutsideClick(ref: any, action: () => void, condition?: boolean) {
  useEffect(() => {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const targetId = target.id;

      if (condition && targetId === 'scenarioListPopupInput') {
        return;
      }

      if (ref.current && !ref.current.contains(e.target)) {
        action();
      }
    });
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('click', action);
    };
  }, [action, ref, condition]);
}
