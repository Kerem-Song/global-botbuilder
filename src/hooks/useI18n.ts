import { ConditionOperator } from '@models';
import { useTranslation } from 'react-i18next';

export const useI18n = (pageName?: string) => {
  const { t: tc, i18n } = useTranslation('common'.toUpperCase());
  const { t: ts } = useTranslation('sidebar'.toUpperCase());
  const { t } = useTranslation(pageName?.toUpperCase());
  const getConditionOperatorLabel = (isShort: boolean, operator: ConditionOperator) => {
    if (isShort) {
      return tc(`CONDITION_OPERATOR_SHORT_${ConditionOperator[operator].toUpperCase()}`);
    } else {
      return tc(`CONDITION_OPERATOR_${ConditionOperator[operator].toUpperCase()}`);
    }
  };

  return { t, tc, ts, i18n, getConditionOperatorLabel };
};

export default useI18n;
