import { icAdd, icAddDisable } from '@assets';
import { Card, Title } from '@components';
import { usePage, useRootState, useSystemModal } from '@hooks';
import { StaffType } from '@models';
import classNames from 'classnames';
import { FC } from 'react';

export const NewBotCard: FC<{ onClick: () => void }> = ({ onClick }) => {
  const { t, tc } = usePage();
  const staffType = useRootState((state) => state.userInfoReducer.staffType);
  const { error } = useSystemModal();

  const handleOnClickAuth = async () => {
    if (staffType === StaffType.Manager) {
      await error({
        title: tc(`NEW_BOT_CARD_AUTH_ERROR_TITLE`),
        description: (
          <>
            <span style={{ whiteSpace: 'pre-line' }}>
              {tc(`NEW_BOT_CARD_AUTH_ERROR_DESC`)}
            </span>
          </>
        ),
      });
    } else {
      return onClick();
    }
  };

  return (
    <Card
      bordered={false}
      onClick={handleOnClickAuth}
      className={classNames('new-chatbot', { disabled: staffType === StaffType.Manager })}
    >
      <div className="title">
        <img src={staffType === StaffType.Manager ? icAddDisable : icAdd} alt="add" />
        <Title level={3}>{t('NEW_BOT_TITLE')}</Title>
      </div>
      <div className="title-hover">
        <svg width={14} height={14}>
          <path
            d="M 7 0 L 7 14 M 0 7 L 14 7"
            strokeWidth={2}
            stroke={staffType === StaffType.Manager ? '#929292' : '#6993FF'}
            fill="none"
          />
        </svg>
      </div>
    </Card>
  );
};
