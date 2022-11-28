import { FC } from 'react';

import { TitleHelmet } from '../components/common/TitleHelmet';
import { PageProvider } from '../hooks/providers/PageProvider';

export const UtterancePage: FC = () => {
  return (
    <PageProvider pageName="utterance">
      <TitleHelmet />
    </PageProvider>
  );
};

export default UtterancePage;
