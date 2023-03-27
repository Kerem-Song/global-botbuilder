import { icEmptyBot } from '@assets';
import { Button, Card, Col, Input, Row, Skeleton } from '@components';
import { useBotClient, useModalOpen, usePage } from '@hooks';
import { useInputState } from '@hooks/useInputState';
import { IBotInput } from '@models';
import { lunaToast } from '@modules/lunaToast';

import { BotCard } from './BotCard';
import { NewBotCard } from './NewBotCard';
import { NewBotPopup } from './NewBotPopup';

export const DashboardComponent = () => {
  const { value: searchKeyword, onChange } = useInputState();
  const { isOpen, handleIsOpen } = useModalOpen();
  const { t } = usePage();

  const { getBotListQuery, botSaveAsync } = useBotClient();
  const { data, isFetching } = getBotListQuery();

  const handleSave = async (model: IBotInput) => {
    const result = await botSaveAsync(model);
    if (result) {
      handleIsOpen(false);
      lunaToast.success(t('NEW_BOT_OK_MESSAGE'));
    }
  };

  const filteredList = data?.filter((x) =>
    x.botName?.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const isEmpty = () => {
    if (!data) {
      return true;
    }
    if (data.length === 0) {
      return true;
    }

    if (!filteredList?.length) {
      return true;
    }

    return false;
  };

  return (
    <div className="dashboard-wrap">
      <Input
        size="large"
        search
        maxLength={50}
        placeholder={t('SEARCH_PLACEHOLDER')}
        value={searchKeyword}
        onClear={() => console.log('clear')}
        onChange={onChange}
      />
      <p className="chatbot-wrap">
        <span className="my-chatbot">{t('MY_CHATBOT')}</span>
        &nbsp;
        <span className="chatbot-count">{data?.length || 0}</span>
      </p>
      <Row gap={20}>
        {isFetching ? (
          <Col span={8}>
            <Card>
              <Skeleton />
            </Card>
          </Col>
        ) : isEmpty() ? (
          <Col span={24}>
            <div className="empty-card">
              <div className="content">
                <img src={icEmptyBot} alt="emptyBot" />
                <p className="description">{t('EMPTY_DESCRIPTION')}</p>
                <Button type="primary" onClick={() => handleIsOpen(true)}>
                  <span className="button-label">{t('NEW_BOT_TITLE')}</span>
                </Button>
              </div>
            </div>
          </Col>
        ) : (
          <>
            <Col span={8}>
              <NewBotCard onClick={() => handleIsOpen(true)} />
            </Col>
            {filteredList?.map((bot) => {
              return (
                <Col key={bot.id} span={8}>
                  <BotCard model={bot} />
                </Col>
              );
            })}
          </>
        )}
      </Row>
      <NewBotPopup isOpen={isOpen} handleIsOpen={handleIsOpen} handleSave={handleSave} />
    </div>
  );
};
