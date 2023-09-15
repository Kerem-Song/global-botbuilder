import { usePage } from '@hooks';

export const useHistoryViewerMatch = () => {
  console.log('@use history viewer match hook');
  const { isReadOnly } = usePage();

  if (isReadOnly) {
    return true;
  }
  return false;
};
