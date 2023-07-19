import { FC } from 'react';
import { Navigate } from 'react-router';

export const ScenarioNavigate: FC = () => {
  return <Navigate to={`${location.pathname}/start`} replace={true} />;
};
