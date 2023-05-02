import { icNoResult } from '@assets';
import { usePage } from '@hooks';

export const EmptyEntry = () => {
  const { t } = usePage();

  return (
    <div className="emptyList">
      <div className="empty">
        <img src={icNoResult} alt="empty" />
        <span>{t('NO_ENTRY_REGISTERED')}</span>
      </div>
    </div>
  );
};
