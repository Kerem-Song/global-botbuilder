import { usePage } from '@hooks';

export const useHistoryViewerMatch = () => {
  const { isReadOnly } = usePage();

  if (isReadOnly) {
    return true;
  }
  return false;
};
