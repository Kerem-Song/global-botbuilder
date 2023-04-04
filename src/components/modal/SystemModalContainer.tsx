import { Button, Divider, Row, Space, Title } from '@components';
import { useEffect } from 'react';
import ReactModal from 'react-modal';
import { useDispatch } from 'react-redux';

import { useRootState } from '../../hooks/useRootState';
import { systemModalClose } from '../../store/systemModalSlice';

export const SystemModalContainer = () => {
  const modalInfo = useRootState((state) => state.systemModalReducer);
  const dispatch = useDispatch();
  const handleClose = () => {
    modalInfo.cancelFunc?.();
    dispatch(systemModalClose());
  };

  const handleConfirm = () => {
    modalInfo.callbackFunc?.();
    dispatch(systemModalClose());
  };

  return (
    <ReactModal
      className="luna-system-modal"
      isOpen={modalInfo.isOpen}
      overlayClassName="luna-system-modal-overlay"
      shouldCloseOnOverlayClick={false}
      onRequestClose={() => {
        modalInfo.closeFunc?.();
        dispatch(systemModalClose());
      }}
    >
      <div className="title">
        <Title level={4}>{modalInfo.message}</Title>
      </div>
      <Divider style={{ margin: 0 }} />
      <div className="content">{modalInfo.description}</div>
      <Row justify="flex-end" style={{ padding: '0 20px 20px 20px' }}>
        <Space>
          {modalInfo.cancelButton ? (
            <Button className="min-w-100" onClick={handleClose}>
              {modalInfo.cancelButton}
            </Button>
          ) : (
            <></>
          )}

          <Button
            className="min-w-100"
            htmlType="submit"
            type="primary"
            onClick={handleConfirm}
          >
            {modalInfo.confirmButton}
          </Button>
        </Space>
      </Row>
    </ReactModal>
  );
};
