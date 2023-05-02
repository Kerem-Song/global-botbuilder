import { icNoResult } from '@assets';
import { Card } from '@components';
import { usePage } from '@hooks';
import { FC } from 'react';

export interface IEmptyEntityCardProps {
  searchKeyword?: string;
}

export const EmptyEntityCard: FC<IEmptyEntityCardProps> = ({ searchKeyword }) => {
  const { t } = usePage();
  return (
    <Card radius="normal" className="emptyEntityCardWrapper">
      <div className="emptyEntityCard">
        <img className="emptyImg" src={icNoResult} alt="empty" />
        {searchKeyword ? (
          <span>{t('NO_SEARCH_ENTRIES_RESULT_FOUND')}</span>
        ) : (
          <span>{t('NO_ENTRIES_REGISTERED')}</span>
        )}
      </div>
    </Card>
  );
};
