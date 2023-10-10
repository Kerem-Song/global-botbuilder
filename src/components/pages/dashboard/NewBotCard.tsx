import { icAdd, icAddDisable } from '@assets';
import { Card, Title } from '@components';
import { usePage, useRootState } from '@hooks';
import { Role, StaffType } from '@models';
import { util } from '@modules';
import classNames from 'classnames';
import { FC } from 'react';

export const NewBotCard: FC<{ onClick: () => void }> = ({ onClick }) => {
  const { t } = usePage();
  const role = useRootState((state) => state.userInfoReducer.role);
  const staffType = useRootState((state) => state.userInfoReducer.staffType);

  const isValidCreateNewChatBot = util.checkRole(Role.Setting, staffType, role);

  const handleOnClickAuth = async () => {
    if (!isValidCreateNewChatBot) {
      return;
    }
    return onClick();
  };

  return (
    <Card
      bordered={false}
      onClick={handleOnClickAuth}
      className={classNames('createNewChatBot', {
        disabled: !isValidCreateNewChatBot,
        newChatbot: isValidCreateNewChatBot,
      })}
    >
      <div className="title">
        <img src={isValidCreateNewChatBot ? icAdd : icAddDisable} alt="add" />
        <Title level={3}>{t('NEW_BOT_TITLE')}</Title>
      </div>
      {isValidCreateNewChatBot && (
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
