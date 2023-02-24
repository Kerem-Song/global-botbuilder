import { useQueryParams } from '@hooks/useQueryParams';
import { Navigate } from 'react-router';

export const AuthPage = () => {
  const queryParams = useQueryParams();
  const code = queryParams.get('code');
  const brandId = queryParams.get('brandId');

  if (!brandId || !code) {
    return <></>;
  }

  return <Navigate to="/" />;
};
