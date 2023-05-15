import { DeployComponent } from '@components/pages/deploy/DeployComponent';
import { FC } from 'react';

import { TitleHelmet } from '../components/common/TitleHelmet';
import { PageProvider } from '../hooks/providers/PageProvider';

export const DeploymentPage: FC = () => {
  return (
    <PageProvider pageName="deployment">
      <TitleHelmet />
      <DeployComponent />
    </PageProvider>
  );
};

export default DeploymentPage;
