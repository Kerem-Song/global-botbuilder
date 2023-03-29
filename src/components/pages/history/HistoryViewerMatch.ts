import { usePage } from '@hooks';

export const HistoryViewerMatch = () => {
  const { isReadOnly } = usePage();

  if (isReadOnly) {
    return true;
  }
  return false;
};
