import { Button } from '@components';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { useDeployClient } from '@hooks/client/deployClient';
import { IDeploy } from '@models/interfaces/IDeploy';
import { lunaToast } from '@modules/lunaToast';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { DeployingModal } from './DeployingModal';

export const DeployButtons = () => {
  const [activate, setActivate] = useState<boolean>();
  const [opLinked, setOpLinked] = useState<boolean>();
  const [testLinked, setTestLinked] = useState<boolean>();
  const [isOp, setIsOp] = useState<boolean>(false);
  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
  const { t } = usePage();
  const { deployingBotAsync, isDeployingBotIsLoading } = useDeployClient();
  const { confirm, error } = useSystemModal();
  const { refetchBotInfo } = useBotClient();
  const { botId } = useParams();

  const handleDeployChannel = async (isOpChannel: boolean) => {
    setIsOp(isOpChannel);
    const isLive = botInfo?.channelInfos?.find((x) => x.isLive)?.name;
    const isTest = botInfo?.channelInfos?.find((x) => !x.isLive)?.name;
    const result = await confirm({
      title: isOpChannel ? t('DEPLOY_OPERATIONAL_CHANNEL') : t('DEPLOY_TEST_CHANNEL'),
      description: (
        <span>
          <span style={{ color: 'blue' }}>{isOpChannel ? isLive : isTest}</span>
          <span style={{ whiteSpace: 'pre-wrap' }}>
            {' '}
            {t('DEPLOYING_CONFIRM_MESSAGE')}
          </span>
        </span>
      ),
    });
    if (result) {
      const deployChannel: IDeploy = {
        botId: botId!,
        isLive: isOpChannel,
      };
      const res = await deployingBotAsync(deployChannel);
      if (res && res.isSuccess) {
        lunaToast.success(t('DEPLOYING_SUCCESS'));
      } else {
        error({
          title: t('DEPLOYING_FAILED'),
          description: (
            <p style={{ whiteSpace: 'break-spaces' }}>
              {res && res.exception!.errorCode === 7633
                ? t('DEPLOYING_CHANNEL_CONNECT_FAILED_MESSAGE')
                : t('DEPLOYING_FAILED_MESSAGE')}
            </p>
          ),
        });
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    if (botId) {
      refetchBotInfo(botId);
    }
  }, [botId]);

  useEffect(() => {
    if (botInfo) {
      setActivate(botInfo.activated);
      setOpLinked(botInfo.channelInfos?.find((x) => x.isLive)?.isLinked);
      setTestLinked(botInfo.channelInfos?.find((x) => !x.isLive)?.isLinked);
    }
  }, [botInfo]);

  return (
    <div className="deployBtns">
      <Button
        style={{ marginRight: '8px' }}
        type="lineBlue"
        disabled={activate && testLinked ? false : true}
        onClick={() => handleDeployChannel(false)}
      >
        {t('DEPLOY_TEST_CHANNEL')}
      </Button>
      <Button
        type="primary"
        disabled={activate && opLinked ? false : true}
        onClick={() => handleDeployChannel(true)}
      >
        {t('DEPLOY_OPERATIONAL_CHANNEL')}
      </Button>
      <DeployingModal isOpenDeployingModal={isDeployingBotIsLoading} isOp={isOp} />
    </div>
  );
};
