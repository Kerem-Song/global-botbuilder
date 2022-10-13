import { useContext } from 'react';

import { HttpContext } from './providers/HttpProvider';

export const useHttp = () => {
  const context = useContext(HttpContext);
  if (!context) {
    throw new Error('Provider를 감싸줘야 합니다.');
  }
  return context;
};
export default useHttp;
