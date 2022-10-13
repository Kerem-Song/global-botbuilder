import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import { TitleHelmet } from '../../components/common/TitleHelmet';
import { PageProvider } from '../../hooks/providers/PageProvider';
import useI18n from '../../hooks/useI18n';

export const ScenarioPage = () => {
  const { i18n, t } = useI18n('test');

  const navigate = useNavigate();
  return (
    <PageProvider pageName="test">
      <TitleHelmet />
      <div>{t('TITLE')}</div>
      <button onClick={() => navigate(`/${i18n.language}/scenario`)}>GO</button>
    </PageProvider>
  );
};

export default ScenarioPage;
