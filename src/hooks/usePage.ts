import { PageContext } from '@hooks';
import { useContext } from 'react';

export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('Provider를 감싸줘야 합니다.');
  }
  return context;
};
export default usePage;
