import { usePage } from '@hooks';
import { FC } from 'react';
import ReactLoading from 'react-loading';
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
        <ReactLoading type="spin" color="#4478FF" height={50} width={50} />
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
