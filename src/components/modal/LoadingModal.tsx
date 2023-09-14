import { usePage } from '@hooks';
import { FC } from 'react';
import ReactLoading from 'react-loading';
import ReactModal from 'react-modal';

export interface ILavingModalProps {
  isOpen: boolean;
  title: string;
  desc: string;
}

export const LoadingModal: FC<ILavingModalProps> = ({ isOpen, title, desc }) => {
  const { t } = usePage();
  return (
    <ReactModal
      style={{ overlay: { display: 'flex' } }}
      className="loadingModal"
      isOpen={isOpen}
      overlayClassName="luna-system-modal-overlay"
    >
      <div className="contents">
        <ReactLoading type="spin" color="#4478FF" height={50} width={50} />
        <div className="title">
          <span>{t(title)}</span>
        </div>
        <div className="text">
          <p>{t(desc)}</p>
        </div>
      </div>
    </ReactModal>
  );
};
