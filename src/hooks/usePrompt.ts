/**
 * Prompts a user when they exit the page
 */

import { useEffect } from 'react';

import { useCallbackPrompt } from './useCallbackPrompt';

export function usePrompt(when = true) {
  useCallbackPrompt(when);
  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = '';
  };

  useEffect(() => {
    if (when) {
      window.addEventListener('beforeunload', preventClose);
    }

    return () => {
      window.removeEventListener('beforeunload', preventClose);
    };
  }, [when]);
}
