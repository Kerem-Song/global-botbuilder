import { TitleHelmet } from '@components/common';
import { PageProvider } from '@hooks/providers/PageProvider';

import { HistoryViewerComponent } from './HistoryViewerComponent';

export const HistoryViewer = () => {
  return (
    <PageProvider pageName="hitoryViewer" isReadOnly>
      <TitleHelmet />
      <HistoryViewerComponent />
    </PageProvider>
  );
};
