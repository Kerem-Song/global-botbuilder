import { useTranslation } from 'react-i18next';
import { useMatch } from 'react-router';

export const HistoryViewerMatch = () => {
  const { i18n } = useTranslation();
  const matchHistoryViewer = useMatch(`/${i18n.language}/:botId/viewer`);

  if (matchHistoryViewer) {
    return true;
  }
  return false;
};
