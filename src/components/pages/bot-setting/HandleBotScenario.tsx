import { Button, Card, Space } from '@components';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { useSessionTokenClient } from '@hooks/client/sessionTokenClient';
import { lunaToast } from '@modules/lunaToast';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

export const HandleBotScenario = () => {
  const { t } = usePage();
  const { confirm, info } = useSystemModal();
  const { botId } = useParams();
  const { botExportAsync, botImportAsync } = useBotClient();
  const { refetchSessionToken } = useSessionTokenClient();
  const botSettingInfo = useRootState(
    (state) => state.botSettingInfoReducer.botSettingInfo,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

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

  const handleImportBotScenario = async (file: File) => {
    const SUPPORTED_FORMATS = ['application/json']; // json 확장자로 사용자 지정 파일 설정
    if (SUPPORTED_FORMATS.includes(file.type)) {
      const importScenarioConfirm = await confirm({
        title: t('IMPORT_SCENARIO'),
        description: (
          <p style={{ whiteSpace: 'pre-wrap' }}>{t('CONFIRM_IMPORT_SCENARIO_MESSAGE')}</p>
        ),
      });

      if (importScenarioConfirm && botSettingInfo && botId) {
        const importScenario = {
          file,
          botId: botSettingInfo.id,
        };

        const res = await botImportAsync({ ...importScenario, customErrorCode: [7800] });

        if (res === 7800) {
          await info({
            title: t('DISABLED_IMPORT_SCENARIO'),
            description: (
              <p style={{ whiteSpace: 'pre-line' }}>
                {t('DISABLED_IMPORT_SCENARIO_MESSAGE')}
              </p>
            ),
          });
        } else {
          refetchSessionToken(botId);
          lunaToast.success(t('IMPORT_SCENARIO_SUCCESS'));
        }
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
  };

  const handleImportBtnClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.click();
    }
  }, [inputRef]);

  useEffect(() => {
    if (uploadFile) {
      handleImportBotScenario(uploadFile);
    }
  }, [uploadFile]);

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
              accept="application/json"
              className="fileInput"
              ref={inputRef}
              onChange={(e) => setUploadFile(e.target.files && e.target.files[0])}
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
