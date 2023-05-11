import { createElement, useEffect } from 'react';
import {
  unstable_Blocker as Blocker,
  unstable_useBlocker as useBlocker,
} from 'react-router';

import usePage from './usePage';
import { useSystemModal } from './useSystemModal';

export const useCallbackPrompt = (when: boolean) => {
  const { confirm } = useSystemModal();
  const { tc } = usePage();
  const blocker = useBlocker(when);

  useEffect(() => {
    if (blocker.state === 'blocked' && when) {
      confirmNavigation({ blocker });
    }
  }, [blocker, when]);

  const confirmNavigation = async ({ blocker }: { blocker: Blocker }) => {
    if (blocker.state === 'blocked') {
      const message = createElement(
        'span',
        { style: { whiteSpace: 'pre-line' } },
        tc('SAVE_CONFIRM_MESSAGE'),
      );
      const result = await confirm({
        title: tc('SAVE'),
        description: message,
      });

      if (result) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  };
};
