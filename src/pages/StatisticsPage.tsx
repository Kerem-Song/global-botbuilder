import { FC } from 'react';

import { TitleHelmet } from '../components/common/TitleHelmet';
import { PageProvider } from '../hooks/providers/PageProvider';

export const StatisticsPage: FC = () => {
  return (
    <PageProvider pageName="statistics">
      <TitleHelmet />
    </PageProvider>
  );
};

export default StatisticsPage;
