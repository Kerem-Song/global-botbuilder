import { Col, Divider, Input, Row, Space, Title } from '@components/index';
import { IBotModel } from '@models/interfaces';
import { toast } from 'react-toastify';

import { useBotClient } from '../../../hooks/client/botClient';
import { useModalOpen } from '../../../hooks/useModalOpen';
import usePage from '../../../hooks/usePage';
import { useRootState } from '../../../hooks/useRootState';
import { BotCard } from './BotCard';
import { NewBotCard } from './NewBotCard';
import { NewBotPopup } from './NewBotPopup';

export const DashboardComponent = () => {
  const { isOpen, handleIsOpen } = useModalOpen();
  const { t } = usePage();
  const brandName = useRootState((state) => state.brandInfoReducer.brandName);

  const { getBotListQuery, botSaveMutate } = useBotClient();
  const { data, isFetching } = getBotListQuery;
  const handleSave = async (model: IBotModel) => {
    const result = await botSaveMutate.mutateAsync(model);
    if (result) {
      handleIsOpen(false);
      toast('새로운 챗봇을 만들었습니다!', { position: 'bottom-right' });
    }
  };
  return (
    <>
      <Title>{brandName}</Title>
      <Row align="flex-end" justify="space-between">
        <Col>{t('CHATBOT_COUNT', { count: data?.length })}</Col>
        <Col style={{ width: '300px' }}>
          <Input placeholder={t('SEARCH_PLACEHOLDER')} />
        </Col>
      </Row>
      <Divider />
      <Space direction="vertical">
        <NewBotCard onClick={() => handleIsOpen(true)} />
        {data?.map((bot) => {
          return <BotCard key={bot.id} name={bot.name} updateDate={bot.updateDate} />;
        })}
      </Space>
      <NewBotPopup isOpen={isOpen} handleIsOpen={handleIsOpen} handleSave={handleSave} />
    </>
  );
};
