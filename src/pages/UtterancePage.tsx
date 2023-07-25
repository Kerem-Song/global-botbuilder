import { TitleHelmet } from '@components';
import { UtteranceComponent } from '@components/pages/utterance/UtteranceComponent';
import { PageProvider } from '@hooks';
import { FC } from 'react';

export const UtterancePage: FC = () => {
  return (
    <PageProvider pageName="utterance">
      <TitleHelmet />
      <UtteranceComponent />
    </PageProvider>
  );
};

export default UtterancePage;
