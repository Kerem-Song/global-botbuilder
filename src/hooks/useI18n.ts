import { useTranslation } from 'react-i18next';

export const useI18n = (pageName?: string) => {
  const { t: tc, i18n } = useTranslation('common');
  const { t } = useTranslation(pageName);
  return { t, tc, i18n };
};

export default useI18n;
