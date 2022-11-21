import { Button, Divider, Input, Row, Space, Title } from '@components/index';
import { Col } from '@components/layout/Col';
import { yupResolver } from '@hookform/resolvers/yup';
import { IBotModel } from '@models/interfaces';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';

const defaultValues = {
  name: '',
};

const schema = yup
  .object({
    name: yup.string().required(),
  })
  .required();

export const NewBotPopup: FC<{
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
  handleSave: (model: IBotModel) => Promise<void>;
}> = ({ isOpen, handleIsOpen, handleSave }) => {
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
        overlay: { zIndex: 200 },
        content: { width: '600px', height: 'fit-content', margin: 'auto' },
      }}
      isOpen={isOpen}
      onAfterOpen={() => {
        setFocus('name');
      }}
    >
      <Title level={4}>새 봇 만들기</Title>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row align="center">
          <Col span={6}>봇 이름</Col>
          <Col span={18}>
            <Input
              placeholder="봇 이름을 입력해주세요."
              {...register('name')}
              maxLength={20}
              showCount
              aria-invalid={errors.name ? 'true' : 'false'}
            />
          </Col>
        </Row>
        <Divider />
        <Row justify="flex-end">
          <Space>
            <Button onClick={handleClose}>취소</Button>
            <Button htmlType="submit">확인</Button>
          </Space>
        </Row>
      </form>
    </ReactModal>
  );
};
