import { ScenarioComponent } from '@components/pages/scenario/ScenarioComponent';

import { TitleHelmet } from '../../components/common/TitleHelmet';
import { PageProvider } from '../../hooks/providers/PageProvider';

export const ScenarioPage = () => {
  return (
    <PageProvider pageName="scenario">
      <TitleHelmet />
      <ScenarioComponent />
    </PageProvider>
  );
};

export default ScenarioPage;
