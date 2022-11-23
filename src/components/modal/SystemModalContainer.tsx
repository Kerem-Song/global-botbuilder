import { Button, Col, Row } from '@components/index';
import ReactModal from 'react-modal';
import { useDispatch } from 'react-redux';

import { useRootState } from '../../hooks/useRootState';
import { systemModalClose } from '../../store/systemModalSlice';

export const SystemModalContainer = () => {
  const modalInfo = useRootState((state) => state.systemModalReducer);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(systemModalClose());
  };
  return (
    <ReactModal
      style={{
        content: {
          width: '328px',
          minHeight: '160px',
          height: 'fit-content',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '80px',
          display: 'flex',
          flexDirection: 'column',
          border: 0,
          padding: 0,
        },
      }}
      isOpen={modalInfo.isOpen}
    >
      <div
        style={{
          flex: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontWeight: 700, color: '#222222', paddingBottom: '8px' }}>
          {modalInfo.message}
        </div>
        {modalInfo.description && (
          <div style={{ fontWeight: 500, color: '#222222' }}>{modalInfo.description}</div>
        )}
      </div>
      <Row style={{ borderTop: '1px solid #DCDCDC' }}>
        <Col flex="auto" style={{ borderRight: '1px solid #DCDCDC' }}>
          <Button block shape="ghost" onClick={handleClose}>
            <span style={{ fontWeight: 700, color: '#929292' }}>Cancel</span>
          </Button>
        </Col>
        <Col flex="auto">
          <Button block shape="ghost">
            <span style={{ fontWeight: 700, color: '#222222' }}>Confirm</span>
          </Button>
        </Col>
      </Row>
    </ReactModal>
  );
};
