import { useNavigate } from 'react-router-dom';

import { TitleHelmet } from '../../components/common/TitleHelmet';
import { PageProvider } from '../../hooks/providers/PageProvider';
import useI18n from '../../hooks/useI18n';

export const ScenarioPage = () => {
  const { i18n, t } = useI18n('scenario');

  const navigate = useNavigate();
  return (
    <PageProvider pageName="scenario">
      <TitleHelmet />
      <div>{t('TITLE')}</div>
      <button onClick={() => navigate(`/${i18n.language}/test`)}>GO</button>
    </PageProvider>
  );
};

export default ScenarioPage;
