import { Button } from '@components';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { useDeployClient } from '@hooks/client/deployClient';
import { IDeploy } from '@models/interfaces/IDeploy';
import { lunaToast } from '@modules/lunaToast';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { DeployingModal } from './DeployingModal';

export const DeployButton = () => {
  const { t } = usePage();
  const { deployingBot, isDeployingBotIsLoading } = useDeployClient();
  const { confirm, error } = useSystemModal();
  const { refetchBotInfo } = useBotClient();
  const { botId } = useParams();

  const [activate, setActivate] = useState<boolean>();
  const [opLinked, setOpLinked] = useState<boolean>();
  const [testLinked, setTestLinked] = useState<boolean>();
  const [channelInfos, setChannelInfos] = useState<string | undefined>('');

  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);

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
      setChannelInfos(botInfo.channelInfos?.find((x) => x.isLive)?.name);
    }
  }, [botInfo]);

  const handleDeployChannel = async () => {
    const result = await confirm({
      title: testLinked ? t('DEPLOY_TEST_CHANNEL') : t('DEPLOY_OPERATIONAL_CHANNEL'),
      description: (
        <span>
          <span style={{ color: 'blue' }}>{channelInfos}</span> 채널에
          <br />
          모든 변경사항을 배포하시겠습니까?
        </span>
      ),
    });
    if (result) {
      const deployChannel: IDeploy = {
        botId: botId!,
        isLive: testLinked ? false : true,
      };
      const res = await deployingBot.mutateAsync(deployChannel);
      if (res && res.isSuccess) {
        lunaToast.success('배포가 완료되었습니다.');
      } else {
        error({
          title: t('DEPLOYING_FAILED'),
          description:
            // res && res.exception!.errorCode == 7633
            //   ? t('DEPLOYING_CHANNEL_CONNECT_FAILED_MESSAGE')
            //   : t('DEPLOYING_FAILED_MESSAGE'),
            t('DEPLOYING_CHANNEL_CONNECT_FAILED_MESSAGE'),
        });
      }
    } else {
      return;
    }
  };

  return (
    <div className="deployBtns">
      <Button
        style={{ marginRight: '8px' }}
        type="lineBlue"
        disabled={activate && testLinked ? false : true}
        onClick={handleDeployChannel}
      >
        {t('DEPLOY_TEST_CHANNEL')}
      </Button>
      <Button
        type="primary"
        disabled={activate && opLinked ? false : true}
        onClick={handleDeployChannel}
      >
        {t('DEPLOY_OPERATIONAL_CHANNEL')}
      </Button>
      <DeployingModal
        isOpenDeployingModal={isDeployingBotIsLoading}
        testLinked={testLinked}
      />
    </div>
  );
};
