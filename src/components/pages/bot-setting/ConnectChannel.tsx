import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { lunaToast } from '@modules/lunaToast';
import { useEffect, useState } from 'react';

import { ConnectChannelCard } from './ConnectChannelCard';

export const ConnectChannel = () => {
  const { t } = usePage();
  const [activate, setActivate] = useState<boolean>();
  const [opLinked, setOpLinked] = useState<boolean>();
  const [testLinked, setTestLinked] = useState<boolean>();
  const botSettingInfo = useRootState(
    (state) => state.botSettingInfoReducer.botSettingInfo,
  );
  const { botChannelActivateAsync } = useBotClient();
  const { confirm, info } = useSystemModal();

  const testChannelName =
    (botSettingInfo && botSettingInfo.channelInfos?.[0].name) || '@ -';
  const opChannelName =
    (botSettingInfo && botSettingInfo.channelInfos?.[1].name) || '@ -';

  const handleConnectChannel = async (isOpChannel: boolean) => {
    const linkedState = isOpChannel ? opLinked : testLinked;
    const setLinkedState = isOpChannel ? setOpLinked : setTestLinked;

    if (
      !isOpChannel &&
      botSettingInfo?.channelInfos?.find(
        (x) => x.linkable === false && x.isLive === false && x.isLinked === false,
      )
    ) {
      await info({
        title: t('DISABLED_CONNECT_TEST_CHANNEL'),
        description: (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <span>{t('DISABLED_CONNECT_TEST_CHANNEL_INFO')}</span>
          </div>
        ),
      });
      return;
    }

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
        botId: botSettingInfo!.id,
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
      }
    }
  };

  useEffect(() => {
    if (botSettingInfo) {
      setActivate(botSettingInfo.activated);
      setOpLinked(botSettingInfo.channelInfos?.find((x) => x.isLive)?.isLinked);
      setTestLinked(botSettingInfo.channelInfos?.find((x) => !x.isLive)?.isLinked);
    }
  }, [botSettingInfo]);

  return (
    <div className="connectChannelCardContainer">
      <ConnectChannelCard
        channelType="operating"
        channelName={opChannelName}
        linked={opLinked}
        disabled={!activate}
        onConnect={() => handleConnectChannel(true)}
        onDisconnect={() => handleConnectChannel(true)}
      />
      <ConnectChannelCard
        channelType="test"
        channelName={testChannelName}
        linked={testLinked}
        disabled={!activate}
        onConnect={() => handleConnectChannel(false)}
        onDisconnect={() => handleConnectChannel(false)}
      />
    </div>
  );
};
