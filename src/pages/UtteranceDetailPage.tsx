import { UtteranceDetail } from '@components/pages/utterance/UtteranceDetail';
import { UtteranceDetailComponent } from '@components/pages/utterance/UtteranceDetailComponent';
import { FC } from 'react';

import { TitleHelmet } from '../components/common/TitleHelmet';
import { PageProvider } from '../hooks/providers/PageProvider';

export const UtteranceDetailPage: FC = () => {
  return (
    <PageProvider pageName="UtternaceDetailPage">
      <TitleHelmet />
      <UtteranceDetailComponent />
    </PageProvider>
  );
};

export default UtteranceDetailPage;
