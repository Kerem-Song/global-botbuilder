import { imgLinebot, imgLinebotInactivate } from '@assets';
import { Button } from '@components';
import { usePage } from '@hooks';
import { FC } from 'react';

export interface IConnectChannelCardProps {
  channelType: 'operating' | 'test';
  channelName: string;
  linked?: boolean;
  disabled?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const ConnectChannelCard: FC<IConnectChannelCardProps> = ({
  channelType,
  channelName,
  linked,
  disabled,
  onConnect,
  onDisconnect,
}) => {
  const { t } = usePage();
  const imgUrl = linked ? imgLinebot : imgLinebotInactivate;

  return (
    <div className="connectChannelCardWrap">
      <div className="connectChannelCard">
        <div className="channel">
          <div className="channelImg">
            <img src={imgUrl} alt="socialImg" />
          </div>
          <div className="channelInfo">
            <p className="channelState">
              {channelType === 'operating' ? t('OPERATING_CHANNEL') : t('TEST_CHANNEL')}
            </p>
            <p className="channelName">{channelName}</p>
          </div>
        </div>
        {linked ? (
          <Button type="lineBlue" small onClick={onDisconnect}>
            {t('DISCONNECT')}
          </Button>
        ) : (
          <Button type="primary" disabled={disabled} small onClick={onConnect}>
            {t('CONNECT')}
          </Button>
        )}
      </div>
    </div>
  );
};
