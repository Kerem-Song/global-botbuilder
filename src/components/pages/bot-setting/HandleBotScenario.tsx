import { Button, Card, Space } from '@components';
import { useBotClient, usePage, useRootState } from '@hooks';

export const HandleBotScenario = () => {
  const { t } = usePage();
  const { botExportAsync } = useBotClient();
  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
  const handleExport = async () => {
    if (!botInfo) {
      return;
    }
    await botExportAsync({ botId: botInfo.id, botName: botInfo.botName });
  };
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
            <Button type="lineBlue">{t('IMPORT')}</Button>
          </div>
        </Space>
      </div>
    </Card>
  );
};
