import { icAdd, icAddDisable } from '@assets';
import { Card, Title } from '@components';
import { usePage, useRootState } from '@hooks';
import { StaffType } from '@models';
import classNames from 'classnames';
import { FC } from 'react';

export const NewBotCard: FC<{ onClick: () => void }> = ({ onClick }) => {
  const { t } = usePage();
  const role = useRootState((state) => state.userInfoReducer.role);
  const staffType = useRootState((state) => state.userInfoReducer.staffType);

  const isAdministrator = staffType === StaffType.Administrator && role === 0;
  const isManager = staffType === StaffType.Manager;
  const isRoleInvalidSetting = role !== undefined && role <= 114;
  const isInvalidCreateNewChatBot =
    isManager || (!isAdministrator && isRoleInvalidSetting);

  const handleOnClickAuth = async () => {
    if (isInvalidCreateNewChatBot) {
      return;
    } else {
      return onClick();
    }
  };

  return (
    <Card
      bordered={false}
      onClick={handleOnClickAuth}
      className={classNames('createNewChatBot', {
        disabled: isInvalidCreateNewChatBot,
        newChatbot: !isInvalidCreateNewChatBot,
      })}
    >
      <div className="title">
        <img src={isInvalidCreateNewChatBot ? icAddDisable : icAdd} alt="add" />
        <Title level={3}>{t('NEW_BOT_TITLE')}</Title>
      </div>
      {!isInvalidCreateNewChatBot && (
        <div className="title-hover">
          <svg width={14} height={14}>
            <path
              d="M 7 0 L 7 14 M 0 7 L 14 7"
              strokeWidth={2}
              stroke="#6993FF"
              fill="none"
            />
          </svg>
        </div>
      )}
    </Card>
  );
};
