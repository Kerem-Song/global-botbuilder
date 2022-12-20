import { icAdd } from '@assets';
import { Card, Title } from '@components';
import { usePage } from '@hooks';
import { FC } from 'react';

export const NewBotCard: FC<{ onClick: () => void }> = ({ onClick }) => {
  const { t } = usePage();
  return (
    <Card bordered={false} onClick={onClick} className="new-chatbot">
      <div className="title">
        <img src={icAdd} alt="add" />
        <Title level={3}>{t('NEW_BOT_TITLE')}</Title>
      </div>
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
    </Card>
  );
};
