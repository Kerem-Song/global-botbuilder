/**
 * Prompts a user when they exit the page
 */

import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

import { useSelectedScenarioChange } from './useSelectedScenarioChange';

function useConfirmExit(confirmExit: () => Promise<boolean>, when = true) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) {
      return;
    }

    const push = navigator.push;

    navigator.push = async (...args: Parameters<typeof push>) => {
      const result = await confirmExit();
      if (result !== false) {
        push(...args);
      }
    };

    return () => {
      navigator.push = push;
    };
  }, [navigator, confirmExit, when]);
}

export function usePrompt(when = true) {
  const { handleChangeSelectedScenario } = useSelectedScenarioChange();
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

  const confirmExit = async () => {
    const result = await handleChangeSelectedScenario();
    console.log(result);
    return result;
  };
  useConfirmExit(confirmExit, when);
}
