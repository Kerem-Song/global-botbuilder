import { useI18n, usePage } from '@hooks';
import { Helmet } from 'react-helmet-async';

export const TitleHelmet = () => {
  const { pageName } = usePage();
  const { t } = useI18n(pageName);
  return (
    <Helmet>
      <title>{t('TITLE')}</title>
    </Helmet>
  );
};
