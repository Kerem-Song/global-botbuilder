import { icNoResult } from '@assets';
import { usePage } from '@hooks';
import { FC } from 'react';

export interface IEmptyEntryProps {
  searchKeyword?: string;
}

export const EmptyEntry: FC<IEmptyEntryProps> = ({ searchKeyword }) => {
  const { t } = usePage();

  return (
    <div className="emptyList">
      <div className="empty">
        <img src={icNoResult} alt="empty" />
        <span>
          {searchKeyword ? t('NO_SEARCH_ENTRY_RESULT_FOUND') : t('NO_ENTRY_REGISTERED')}
        </span>
      </div>
    </div>
  );
};
