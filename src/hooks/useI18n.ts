import { useTranslation } from 'react-i18next';

export const useI18n = (pageName?: string) => {
  const { t: tc, i18n } = useTranslation('common');
  const { t: ts } = useTranslation('sidebar');
  const { t } = useTranslation(pageName);
  return { t, tc, ts, i18n };
};

export default useI18n;
