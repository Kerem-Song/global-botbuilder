import { Button, Divider, Input, InputTextarea, Row, Space } from '@components';
import { Title } from '@components/general';
import { usePage } from '@hooks';
import { FC } from 'react';
import ReactModal from 'react-modal';

export interface IDeployDetailModalProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
}

export const DeployDetailModal: FC<IDeployDetailModalProps> = ({
  isOpen,
  handleIsOpen,
}) => {
  const { t, tc } = usePage();
  const handleClose = () => {
    handleIsOpen(false);
  };
  return (
    <ReactModal
      style={{ overlay: { display: 'flex' } }}
      className="deployDetailModal"
      isOpen={isOpen}
    >
      <div className="title">
        <Title level={4}>{t('TITLE')}</Title>
      </div>
      <Divider />
      <div className="contents">
        <div className="deployNumber">
          <Title level={2}>{t('DEPLOY_NUMBER')} : 00037-L (operating channel)</Title>
        </div>
        <div className="deployInfo">
          <div className="info">
            <span className="infoTitle">{t('CHANNEL_NAME')}</span>
            <span className="infoContent">@lunasoft_line</span>
          </div>
          <div className="info">
            <span className="infoTitle">{t('DEPLOYMENT_DATE_AND_TIME')}</span>
            <span className="infoContent">2023-02-13 15:11:13</span>
          </div>
          <div className="info">
            <span className="infoTitle">{t('OPERATOR')}</span>
            <span className="infoContent">Marina(mj.lee@lunasoft.co.kr)</span>
          </div>
          <div className="info">
            <span className="infoTitle">{t('DEPLOYMENT_STATUS')}</span>
            <span className="infoContent">
              <span className="success">Success</span>
            </span>
          </div>
        </div>
        <textarea className="deployNotes" placeholder={t('MEMO')} />
        <div className="modalBtns">
          <Space>
            <Button className="min-w-100" onClick={handleClose}>
              {tc('CANCEL')}
            </Button>
            <Button className="min-w-100" type="primary">
              {tc('OK')}
            </Button>
          </Space>
        </div>
      </div>
    </ReactModal>
  );
};
