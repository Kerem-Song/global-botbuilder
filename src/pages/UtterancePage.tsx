import { UtteranceComponent } from '@components/pages/utterance/UtteranceComponent';
import { FC } from 'react';

import { TitleHelmet } from '../components/common/TitleHelmet';
import { PageProvider } from '../hooks/providers/PageProvider';

export const UtterancePage: FC = () => {
  return (
    <PageProvider pageName="utterance">
      <TitleHelmet />
      <UtteranceComponent />
    </PageProvider>
  );
};

export default UtterancePage;
