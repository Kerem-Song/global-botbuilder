import { Button, Col, Divider, FormItem, Input, Row, Space, Title } from '@components';
import { usePage } from '@hooks';
import { FC } from 'react';
import ReactModal from 'react-modal';
import Select from 'react-select';

export interface NewVariablePopupProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
}

export const NewVariablePopup: FC<NewVariablePopupProps> = ({ isOpen, handleIsOpen }) => {
  const { t, tc } = usePage();
  const handleClose = () => {
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
    >
      <div style={{ padding: '14px 20px 2px 20px' }}>
        <Title level={4}>{t('ADD_VARIABLE')}</Title>
      </div>
      <Divider />
      <form>
        <Row align="center" style={{ padding: '9px 20px 20px 20px' }}>
          <Col span={6}>{t('VARIABLE_NAME')}</Col>
          <Col span={18}>
            <FormItem>
              <Input placeholder={t('INPUT_VARIABLE_NAME_IN_ENGLISH')} />
            </FormItem>
          </Col>
        </Row>
        <Row align="center" style={{ padding: '9px 20px 20px 20px' }}>
          <Col span={6}>{t('VARIABLE_FORMAT')}</Col>
          <Col span={18}>
            <FormItem>
              {/* <Input placeholder={t('BOT_NAME_PLACEHOLDER')} maxLength={20} showCount /> */}
              <Select></Select>
            </FormItem>
          </Col>
        </Row>
        <Row align="center" style={{ padding: '9px 20px 20px 20px' }}>
          <Col span={6}>{t('DEFAULT_VALUE')}</Col>
          <Col span={18}>
            <FormItem>
              <Input placeholder={t('INPUT_VARIABLE')} />
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
