import { Button, Col, Divider, FormItem, Input, Row, Space, Title } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePage, useRootState } from '@hooks';
import { IBotInput, SnsKind } from '@models';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';

export const NewBotPopup: FC<{
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
  handleSave: (model: IBotInput) => Promise<void>;
}> = ({ isOpen, handleIsOpen, handleSave }) => {
  const { t, tc } = usePage();
  const brandId = useRootState((state) => state.brandInfoReducer.brandId);

  const defaultValues: IBotInput = {
    brandId,
    botName: '',
    snsKind: SnsKind.Line,
  };

  const schema = yup
    .object({
      botName: yup.string().required(t('REQUIRE_BOT_NAME')),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<IBotInput>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: IBotInput) => {
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
        content: {
          width: '600px',
          height: 'fit-content',
          margin: 'auto',
          marginTop: '200px',
          padding: 0,
        },
      }}
      isOpen={isOpen}
      onAfterOpen={() => {
        setFocus('botName');
      }}
    >
      <div style={{ padding: '14px 20px 2px 20px' }}>
        <Title level={4}>{t('NEW_BOT_TITLE')}</Title>
      </div>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row align="center" style={{ padding: '9px 20px 20px 20px' }}>
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

        <Row justify="flex-end" style={{ padding: '0 20px 20px 20px' }}>
          <Space>
            <Button className="min-w-100" onClick={handleClose}>
              {tc('CANCEL')}
            </Button>
            <Button className="min-w-100" htmlType="submit" type="primary">
              {tc('OK')}
            </Button>
          </Space>
        </Row>
      </form>
    </ReactModal>
  );
};
