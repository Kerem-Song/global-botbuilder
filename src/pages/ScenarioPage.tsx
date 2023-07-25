import { TitleHelmet } from '@components';
import { ScenarioComponent } from '@components/pages/scenario/ScenarioComponent';
import { PageProvider } from '@hooks';

export const ScenarioPage = () => {
  return (
    <PageProvider pageName="scenario">
      <TitleHelmet />
      <ScenarioComponent />
    </PageProvider>
  );
};

export default ScenarioPage;
