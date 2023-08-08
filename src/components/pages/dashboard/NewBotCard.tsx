import { icAdd, icAddDisable } from '@assets';
import { Card, Title } from '@components';
import { usePage, useRootState, useSystemModal } from '@hooks';
import { StaffType } from '@models';
import classNames from 'classnames';
import { FC } from 'react';

export const NewBotCard: FC<{ onClick: () => void }> = ({ onClick }) => {
  const { t, tc } = usePage();
  const role = useRootState((state) => state.userInfoReducer.role);
  const staffType = useRootState((state) => state.userInfoReducer.staffType);
  const { error } = useSystemModal();

  const isAdministrator = staffType === StaffType.Administrator && role === 0;
  const isManager = staffType === StaffType.Manager;
  const isRoleValid = role !== undefined && role <= 114;

  const handleOnClickAuth = async () => {
    if (isManager || (!isAdministrator && isRoleValid)) {
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
      className={classNames('new-chatbot', {
        disabled: isManager || (!isAdministrator && isRoleValid),
      })}
    >
      <div className="title">
        <img
          src={isManager || (!isAdministrator && isRoleValid) ? icAddDisable : icAdd}
          alt="add"
        />
        <Title level={3}>{t('NEW_BOT_TITLE')}</Title>
      </div>
      <div className="title-hover">
        <svg width={14} height={14}>
          <path
            d="M 7 0 L 7 14 M 0 7 L 14 7"
            strokeWidth={2}
            stroke={
              isManager || (!isAdministrator && isRoleValid) ? '#929292' : '#6993FF'
            }
            fill="none"
          />
        </svg>
      </div>
    </Card>
  );
};
