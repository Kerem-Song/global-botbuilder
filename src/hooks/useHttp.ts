import { HttpContext } from '@hooks';
import { useContext } from 'react';

export const useHttp = () => {
  const context = useContext(HttpContext);
  if (!context) {
    throw new Error('Provider를 감싸줘야 합니다.');
  }
  return context;
};
export default useHttp;
