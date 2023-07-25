import { TitleHelmet } from '@components';
import { IntentDetailComponent } from '@components/pages/intent/IntentDetailComponent';
import { PageProvider } from '@hooks';
import { FC } from 'react';

export const IntentDetailPage: FC = () => {
  return (
    <PageProvider pageName="intentDetailPage">
      <TitleHelmet />
      <IntentDetailComponent />
    </PageProvider>
  );
};

export default IntentDetailPage;
