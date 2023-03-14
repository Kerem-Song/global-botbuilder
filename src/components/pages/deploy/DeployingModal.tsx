import { usePage } from '@hooks';
import { FC } from 'react';
import ReactModal from 'react-modal';

export interface IDeployingModalProps {
  isOpenDeployingModal: boolean;
}

export const DeployingModal: FC<IDeployingModalProps> = ({ isOpenDeployingModal }) => {
  const { t } = usePage();

  return (
    <ReactModal
      style={{ overlay: { display: 'flex' } }}
      className="deployingModal"
      isOpen={isOpenDeployingModal}
    >
      <div className="contents">
        <div className="loading"></div>
        <div className="title">
          <span>{t('DEPLOY_TEST_CHANNEL')}</span>
        </div>
        <div className="text">
          <p>{t('DEPLOYING_MESSAGE')}</p>
        </div>
      </div>
    </ReactModal>
  );
};
