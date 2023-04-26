import { Button, Card, Space } from '@components';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { lunaToast } from '@modules/lunaToast';
import { useCallback, useRef } from 'react';

export const HandleBotScenario = () => {
  const { t } = usePage();
  const { confirm, info } = useSystemModal();
  const { botExportAsync, botImportAsync } = useBotClient();
  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    if (!botInfo) {
      return;
    }
    await botExportAsync({ botId: botInfo.id, botName: botInfo.botName });
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
          botImportAsync({ file: uploadFile, botId: botInfo!.id })
            .then((res) => {
              console.log('botImportAsync data', res?.data);
              lunaToast.success(t('IMPORT_SCENARIO_SUCCESS'));
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
    [botInfo],
  );

  const handleImportBtnClick = useCallback(() => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  }, []);

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
