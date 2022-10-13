import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router';

export const LocaleNavigate: FC = () => {
  const { i18n } = useTranslation();
  return <Navigate to={`${i18n.language}${location.pathname}`} replace={true} />;
};
