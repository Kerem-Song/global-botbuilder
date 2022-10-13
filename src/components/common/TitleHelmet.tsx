import { Helmet } from 'react-helmet-async';

import useI18n from '../../hooks/useI18n';
import usePage from '../../hooks/usePage';

export const TitleHelmet = () => {
  const { pageName } = usePage();
  const { t } = useI18n(pageName);
  return (
    <Helmet>
      <title>{t('TITLE')}</title>
    </Helmet>
  );
};
