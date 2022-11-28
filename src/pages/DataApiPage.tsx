import { FC } from 'react';

import { TitleHelmet } from '../components/common/TitleHelmet';
import { PageProvider } from '../hooks/providers/PageProvider';

export const DataApiPage: FC = () => {
  return (
    <PageProvider pageName="dataapi">
      <TitleHelmet />
    </PageProvider>
  );
};

export default DataApiPage;
