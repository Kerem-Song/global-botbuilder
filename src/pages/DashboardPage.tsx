import { TitleHelmet } from '@components';
import { PageProvider } from '@hooks';
import { FC } from 'react';

import { DashboardComponent } from '../components/pages/dashboard/DashboardComponent';

export const DashboardPage: FC = () => {
  return (
    <PageProvider pageName="dashboard">
      <TitleHelmet />
      <DashboardComponent />
    </PageProvider>
  );
};

export default DashboardPage;
