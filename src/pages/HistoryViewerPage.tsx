import { TitleHelmet } from '@components';
import { PageProvider } from '@hooks';

import { HistoryViewerComponent } from '../components/pages/history/HistoryViewerComponent';

export const HistoryViewer = () => {
  return (
    <PageProvider pageName="scenario" isReadOnly>
      <TitleHelmet />
      <HistoryViewerComponent />
    </PageProvider>
  );
};
