import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { lunaToast } from '@modules/lunaToast';
import { FC, useEffect, useState } from 'react';

import { ConnectChannelCard } from './ConnectChannelCard';

export interface IConnectChannelProps {
  opChannelName?: string;
}

export const ConnectChannel: FC<IConnectChannelProps> = ({ opChannelName }) => {
  const { t } = usePage();
  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
  const [activate, setActivate] = useState<boolean>();
  const [opLinked, setOpLinked] = useState<boolean>();
  const [testLinked, setTestLinked] = useState<boolean>();
  const { botChannelActivateAsync } = useBotClient();
  const { confirm, info } = useSystemModal();

  const handleConnectChannel = async (isOpChannel: boolean) => {
    const linkedState = isOpChannel ? opLinked : testLinked;
    const setLinkedState = isOpChannel ? setOpLinked : setTestLinked;
    const testChannelName = botInfo?.channelInfos?.find((x) => !x.isLive)?.name || '@ -';

    const res = await confirm({
      title: linkedState ? t('DISCONNECT_CHANNEL') : t('CONNECT_CHANNEL'),
      description: (
        <>
          <span className="connectChannel">
            {isOpChannel ? opChannelName : testChannelName}
          </span>
          <span style={{ whiteSpace: 'pre-wrap' }}>
            {linkedState
              ? t('DISCONNECT_CHANNEL_MESSAGE', {
                  channel: isOpChannel ? opChannelName : testChannelName,
                })
              : t('CONFIRM_CONNECT_CHANNEL_MESSAGE')}
          </span>
        </>
      ),
    });

    if (res) {
      const connectChannel = await botChannelActivateAsync({
        isActivate: !linkedState,
        isLive: isOpChannel,
        botId: botInfo!.id,
      });

      if (connectChannel?.data.isSuccess) {
        setLinkedState(!linkedState);

        if (!linkedState) {
          await info({
            title: t('CONNECT_CHANNEL_SUCCESS'),
            description: (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                <span className="connectChannel">
                  {isOpChannel ? opChannelName : testChannelName}
                </span>
                <span>{t('CONNECT_CHANNEL_SUCCESS_MESSAGE')}</span>
              </div>
            ),
          });
        } else {
          lunaToast.success(t('DISCONNECT_CHANNEL_SUCCESS_MESSAGE'));
        }
      } else if (
        connectChannel?.data.exception.exceptionType ===
        'PartnersSNSChannelInfoEmptyException'
      ) {
        await info({
          title: t('DISABLED_CONNECT_TEST_CHANNEL'),
          description: (
            <div style={{ whiteSpace: 'pre-wrap' }}>
              <span>{t('DISABLED_CONNECT_TEST_CHANNEL_INFO')}</span>
            </div>
          ),
        });
      }
    }
  };

  useEffect(() => {
    if (botInfo) {
      setActivate(botInfo.activated);
      setOpLinked(botInfo.channelInfos?.find((x) => x.isLive)?.isLinked);
      setTestLinked(botInfo.channelInfos?.find((x) => !x.isLive)?.isLinked);
    }
  }, [botInfo]);

  return (
    <div className="connectChannelCardContainer">
      <ConnectChannelCard
        channelType="operating"
        channelName={opChannelName!}
        linked={opLinked}
        disabled={!activate}
        onConnect={() => handleConnectChannel(true)}
        onDisconnect={() => handleConnectChannel(true)}
      />
      <ConnectChannelCard
        channelType="test"
        channelName={botInfo?.channelInfos?.find((x) => !x.isLive)?.name || '@ -'}
        linked={testLinked}
        disabled={!activate}
        onConnect={() => handleConnectChannel(false)}
        onDisconnect={() => handleConnectChannel(false)}
      />
    </div>
  );
};
