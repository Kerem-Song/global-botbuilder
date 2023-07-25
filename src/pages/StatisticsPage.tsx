import { TitleHelmet } from '@components';
import { PageProvider } from '@hooks';
import { FC } from 'react';

export const StatisticsPage: FC = () => {
  return (
    <PageProvider pageName="statistics">
      <TitleHelmet />
    </PageProvider>
  );
};

export default StatisticsPage;
