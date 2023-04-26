import { imgLinebot, imgLinebotInactivate } from '@assets';
import { Button } from '@components';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { lunaToast } from '@modules/lunaToast';
import { useEffect, useState } from 'react';

export const ConnectChannel = () => {
  const { t } = usePage();
  const { confirm, info } = useSystemModal();
  const { botChannelActivateAsync } = useBotClient();
  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
  const brandId = useRootState((state) => state.brandInfoReducer.brandId);
  const [activate, setActivate] = useState<boolean>();
  const [opLinked, setOpLinked] = useState<boolean>();
  const [testLinked, setTestLinked] = useState<boolean>();

  const handleConnectChannel = async (isOpChannel: boolean) => {
    const linkedState = isOpChannel ? opLinked : testLinked;
    const setLinkedState = isOpChannel ? setOpLinked : setTestLinked;

    if (!linkedState) {
      const res = await confirm({
        title: t('CONNECT_CHANNEL'),
        description: (
          <>
            <span className="connectChannel">
              {botInfo?.channelInfos?.find((x) => x.isLive)?.name || '@ -'}{' '}
            </span>
            <span>{t('CONFIRM_CONNECT_CHANNEL_MESSAGE')}</span>
          </>
        ),
      });
      if (res) {
        setLinkedState(true);
        await info({
          title: t('CONNECT_CHANNEL_SUCCESS'),
          description: (
            <div style={{ whiteSpace: 'pre-wrap' }}>
              <span className="connectChannel">
                {botInfo?.channelInfos?.find((x) => x.isLive)?.name || '@ -'}{' '}
              </span>
              <span>{t('CONNECT_CHANNEL_SUCCESS_MESSAGE')}</span>
            </div>
          ),
        });
      }
    } else if (linkedState) {
      const res = await confirm({
        title: t('DISCONNECT_CHANNEL'),
        description: (
          <span style={{ whiteSpace: 'pre-wrap' }}>
            {t('DISCONNECT_CHANNEL_MESSAGE', {
              channel: botInfo?.channelInfos?.find((x) => x.isLive)?.name || '@ -',
            })}
          </span>
        ),
      });
      if (res) {
        setLinkedState(false);
        lunaToast.success(t('DISCONNECT_CHANNEL_SUCCESS_MESSAGE'));
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
      <div className="connectChannelCardWrap">
        <div className="connectChannelCard">
          <div className="channel">
            <div className="channelImg">
              {opLinked ? (
                <img src={imgLinebot} alt="socialImg" />
              ) : (
                <img src={imgLinebotInactivate} alt="socialImg" />
              )}
            </div>
            <div className="channelInfo">
              <p className="channelState">{t('OPERATING_CHANNEL')}</p>
              <p className="channelName">
                {botInfo?.channelInfos?.find((x) => x.isLive)?.name || '@ -'}
              </p>
            </div>
          </div>
          {opLinked ? (
            <Button type="lineBlue" small onClick={() => handleConnectChannel(true)}>
              {t('DISCONNECT')}
            </Button>
          ) : (
            <Button
              type="primary"
              disabled={activate === false ? true : false}
              small
              onClick={() => handleConnectChannel(true)}
            >
              {t('CONNECT')}
            </Button>
          )}
        </div>
      </div>
      <div className="connectChannelCardWrap">
        <div className="connectChannelCard">
          <div className="channel">
            <div className="channelImg">
              {testLinked ? (
                <img src={imgLinebot} alt="socialImg" />
              ) : (
                <img src={imgLinebotInactivate} alt="socialImg" />
              )}
            </div>
            <div className="channelInfo">
              <p className="channelState">{t('TEST_CHANNEL')}</p>
              <p className="channelName">
                {botInfo?.channelInfos?.find((x) => !x.isLive)?.name || '@ -'}
              </p>
            </div>
          </div>
          <div className="connectBtns">
            {testLinked ? (
              <Button type="lineBlue" small onClick={() => handleConnectChannel(false)}>
                {t('DISCONNECT')}
              </Button>
            ) : (
              <Button
                type="primary"
                disabled={activate === false ? true : false}
                small
                onClick={() => handleConnectChannel(false)}
              >
                {t('CONNECT')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
