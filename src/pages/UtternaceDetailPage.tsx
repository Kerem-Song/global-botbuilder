import { UtteranceDetail } from '@components/pages/utterance/UtteranceDetail';
import { FC } from 'react';

import { TitleHelmet } from '../components/common/TitleHelmet';
import { PageProvider } from '../hooks/providers/PageProvider';

export const UtternaceDetailPage: FC = () => {
  return (
    <PageProvider pageName="UtternaceDetailPage">
      <TitleHelmet />
      <UtteranceDetail />
    </PageProvider>
  );
};

export default UtternaceDetailPage;
