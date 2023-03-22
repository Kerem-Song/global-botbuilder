import { HistoryMain } from '@components/pages/history/HistoryMain';
import { FC } from 'react';

import { TitleHelmet } from '../components/common/TitleHelmet';
import { PageProvider } from '../hooks/providers/PageProvider';

export const HistoryPage: FC = () => {
  return (
    <PageProvider pageName="history">
      <TitleHelmet />
      <HistoryMain />
    </PageProvider>
  );
};

export default HistoryPage;
