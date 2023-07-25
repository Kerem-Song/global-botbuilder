import { TitleHelmet } from '@components';
import { IntentComponent } from '@components/pages/intent/IntentComponent';
import { PageProvider } from '@hooks';
import { FC } from 'react';

export const IntentPage: FC = () => {
  return (
    <PageProvider pageName="intent">
      <TitleHelmet />
      <IntentComponent />
    </PageProvider>
  );
};

export default IntentPage;
