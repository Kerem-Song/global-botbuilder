import { TitleHelmet } from '@components';
import { PageProvider } from '@hooks';
import { FC } from 'react';

export const DataApiPage: FC = () => {
  return (
    <PageProvider pageName="dataapi">
      <TitleHelmet />
    </PageProvider>
  );
};

export default DataApiPage;
