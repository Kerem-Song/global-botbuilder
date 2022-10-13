import { useContext } from 'react';

import { PageContext } from './providers/PageProvider';

export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('Provider를 감싸줘야 합니다.');
  }
  return context;
};
export default usePage;
