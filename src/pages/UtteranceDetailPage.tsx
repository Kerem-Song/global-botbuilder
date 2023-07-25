import { TitleHelmet } from '@components';
import { UtteranceDetailComponent } from '@components/pages/utterance/UtteranceDetailComponent';
import { PageProvider } from '@hooks';
import { FC } from 'react';

export const UtteranceDetailPage: FC = () => {
  return (
    <PageProvider pageName="utternaceDetailPage">
      <TitleHelmet />
      <UtteranceDetailComponent />
    </PageProvider>
  );
};

export default UtteranceDetailPage;
