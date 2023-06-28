import { Button, Col, Divider, FormItem, Input, Row, Space, Title } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useBotClient, usePage, useRootState } from '@hooks';
import { IBotInput, SnsKind } from '@models';
import { BOTNAME_REGEX } from '@modules';
import { lunaToast } from '@modules/lunaToast';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';

export const NewBotPopup: FC<{
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
}> = ({ isOpen, handleIsOpen }) => {
  const { t, tc } = usePage();
  const brandId = useRootState((state) => state.brandInfoReducer.brandId);
  const { botSaveAsync } = useBotClient();
  const defaultValues: IBotInput = {
    brandId,
    botName: '',
    snsKind: SnsKind.Line,
  };

  const schema = yup
    .object({
      botName: yup
        .string()
        .trim()
        .required(tc('REQUIRE_MESSAGE'))
        .min(2, tc('MIN_LENGTH_MESSAGE', { val: 2 }))
        .matches(BOTNAME_REGEX, {
          message: tc('BOTNAME_REGEX_MESSAGE'),
        }),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setError,
    formState: { errors },
  } = useForm<IBotInput>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleSave = async (model: IBotInput) => {
    const result = await botSaveAsync({ ...model, customErrorCode: [7654] });
    if (result === 7654) {
      setError('botName', {
        type: 'custom',
        message: t(`MSG_DUPLICATED_BOT_NAME`),
      });
    } else {
      handleIsOpen(false);
      lunaToast.success(t('NEW_BOT_OK_MESSAGE'));
    }
  };

  const onSubmit = async (data: IBotInput) => {
    await handleSave(data);
    //reset(defaultValues);
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
      onRequestClose={() => {
        handleClose();
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
          <Col span={6}>
            {t('BOT_NAME_LABEL')}
            <span className="required">*</span>
          </Col>
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
