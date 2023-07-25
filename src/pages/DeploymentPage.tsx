import { TitleHelmet } from '@components';
import { DeployComponent } from '@components/pages/deploy/DeployComponent';
import { PageProvider } from '@hooks';
import { FC } from 'react';

export const DeploymentPage: FC = () => {
  return (
    <PageProvider pageName="deployment">
      <TitleHelmet />
      <DeployComponent />
    </PageProvider>
  );
};

export default DeploymentPage;
