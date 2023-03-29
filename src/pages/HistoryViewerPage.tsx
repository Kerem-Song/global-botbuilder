import { TitleHelmet } from '@components/common';
import { PageProvider } from '@hooks/providers/PageProvider';

import { HistoryViewerComponent } from '../components/pages/history/HistoryViewerComponent';

export const HistoryViewer = () => {
  return (
    <PageProvider pageName="scenario" isReadOnly>
      <TitleHelmet />
      <HistoryViewerComponent />
    </PageProvider>
  );
};
