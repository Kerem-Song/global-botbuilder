import { FC } from 'react';

import { TitleHelmet } from '../components/common/TitleHelmet';
import { DashboardComponent } from '../components/pages/dashboard/DashboardComponent';
import { PageProvider } from '../hooks/providers/PageProvider';

export const DashboardPage: FC = () => {
  return (
    <PageProvider pageName="dashboard">
      <TitleHelmet />
      <DashboardComponent />
    </PageProvider>
  );
};

export default DashboardPage;
