import { FC } from 'react';

import { TitleHelmet } from '../components/common/TitleHelmet';
import { PageProvider } from '../hooks/providers/PageProvider';

export const HistoryPage: FC = () => {
  return (
    <PageProvider pageName="history">
      <TitleHelmet />
    </PageProvider>
  );
};

export default HistoryPage;
