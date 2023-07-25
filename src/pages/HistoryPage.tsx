import { TitleHelmet } from '@components';
import { HistoryMain } from '@components/pages/history/HistoryMain';
import { PageProvider } from '@hooks';
import { FC } from 'react';

export const HistoryPage: FC = () => {
  return (
    <PageProvider pageName="history">
      <TitleHelmet />
      <HistoryMain />
    </PageProvider>
  );
};

export default HistoryPage;
