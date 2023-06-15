import { Button, Card, Space } from '@components';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { useSessionTokenClient } from '@hooks/client/sessionTokenClient';
import { lunaToast } from '@modules/lunaToast';
import { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router';

export const HandleBotScenario = () => {
  const { t } = usePage();
  const { confirm, info } = useSystemModal();
  const { botId } = useParams();
  const { botExportAsync, botImportAsync, getBotSettingInfoQuery } = useBotClient();
  const { refetchSessionToken } = useSessionTokenClient();
  const { data: botSettingInfo } = getBotSettingInfoQuery(botId!);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (botId) {
      refetchSessionToken(botId);
    }
  }, [botId]);

  const handleExport = async () => {
    if (!botSettingInfo) {
      return;
    }
    await botExportAsync({ botId: botSettingInfo.id, botName: botSettingInfo.botName });
  };

  const handleImportBotScenario = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const uploadFile = e.target.files![0];
      const SURPPORTED_FORMATS = ['application/json']; // json 확장자로 사용자 지정 파일 설정

      if (SURPPORTED_FORMATS.includes(uploadFile.type)) {
        const res = await confirm({
          title: t('IMPORT_SCENARIO'),
          description: (
            <p style={{ whiteSpace: 'pre-wrap' }}>
              {t('CONFIRM_IMPORT_SCENARIO_MESSAGE')}
            </p>
          ),
        });
        if (res) {
          botImportAsync({ file: uploadFile, botId: botSettingInfo!.id })
            .then((res) => {
              console.log('botImportAsync data', res?.data);
              lunaToast.success(t('IMPORT_SCENARIO_SUCCESS'));
              refetchSessionToken(botId!);
            })
            .catch((err) => {
              console.log('botImportAsync error', err);
            });
        }
      } else {
        await info({
          title: t('DISABLED_IMPORT_SCENARIO'),
          description: (
            <p style={{ whiteSpace: 'pre-wrap' }}>
              {t('DISABLED_IMPORT_SCENARIO_MESSAGE')}
            </p>
          ),
        });
      }
    },
    [botSettingInfo],
  );

  const handleImportBtnClick = useCallback(() => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  }, [inputRef]);

  return (
    <Card className="settingCardWrap" radius="normal">
      <div className="handleScenariosWrap">
        <Space direction="vertical">
          <p className="settingCardTitle">{t('EXPORT_IMPORT_SCENARIOS')}</p>
          <div className="handleScenarioInfo">
            <p className="infoText">{t('EXPORT_IMPORT_SCENARIOS_DESC')}</p>
          </div>
          <div className="duplicateScenarios">
            <div className="text">
              <p>{t('DUPLICATE_SCENARIOS')}</p>
            </div>
            <Button className="duplicateBtn" type="primary" onClick={handleExport}>
              {t('EXPORT')}
            </Button>
            <input
              type="file"
              className="fileInput"
              ref={inputRef}
              onChange={handleImportBotScenario}
            />
            <Button type="lineBlue" onClick={handleImportBtnClick}>
              {t('IMPORT')}
            </Button>
          </div>
        </Space>
      </div>
    </Card>
  );
};
