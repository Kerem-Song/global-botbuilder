import { Button, Divider, FormItem, Input, Row, Space, Title } from '@components/index';
import { Col } from '@components/layout/Col';
import { yupResolver } from '@hookform/resolvers/yup';
import { IBotModel } from '@models/interfaces';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';

import usePage from '../../../hooks/usePage';

const defaultValues: IBotModel = {
  botName: '',
};

const schema = yup
  .object({
    botName: yup.string().required('봇 이름은 필수입니다.'),
  })
  .required();

export const NewBotPopup: FC<{
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
  handleSave: (model: IBotModel) => Promise<void>;
}> = ({ isOpen, handleIsOpen, handleSave }) => {
  const { t, tc } = usePage();
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<IBotModel>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: IBotModel) => {
    await handleSave(data);
    reset(defaultValues);
  };

  const handleClose = () => {
    reset(defaultValues);
    handleIsOpen(false);
  };

  return (
    <ReactModal
      style={{
        content: { width: '600px', height: 'fit-content', margin: 'auto' },
      }}
      isOpen={isOpen}
      onAfterOpen={() => {
        setFocus('botName');
      }}
    >
      <Title level={4}>{t('NEW_BOT_TITLE')}</Title>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row align="center">
          <Col span={6}>{t('BOT_NAME_LABEL')}</Col>
          <Col span={18}>
            <FormItem error={errors.botName}>
              <Input
                placeholder={t('BOT_NAME_PLACEHOLDER')}
                {...register('botName')}
                maxLength={20}
                showCount
              />
            </FormItem>
          </Col>
        </Row>
        <Divider />
        <Row justify="flex-end">
          <Space>
            <Button onClick={handleClose}>{tc('CANCEL')}</Button>
            <Button htmlType="submit">{tc('OK')}</Button>
          </Space>
        </Row>
      </form>
    </ReactModal>
  );
};
