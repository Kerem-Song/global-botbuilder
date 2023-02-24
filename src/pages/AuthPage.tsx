import { useQueryParams } from '@hooks/useQueryParams';
import { Navigate, useParams } from 'react-router';

export const AuthPage = () => {
  const queryParams = useQueryParams();
  const code = queryParams.get('code');
  const brandId = queryParams.get('brandId');

  if (!brandId) {
    return <></>;
  }

  return <Navigate to="/" />;

  return (
    <div>
      parameter : {code},{brandId}
    </div>
  );
};
