import { createBrowserHistory } from 'history';
import React, { useCallback, useRef } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useRootState } from '../../hooks/useRootState';
import { systemModalClose } from '../../store/systemModalSlice';

const SystemModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const isOpen = useRootState((state) => state.systemModalReducer.isOpen);
  const history = createBrowserHistory();
  const dispatch = useDispatch();
  const handleSystemModalClose = useCallback(
    () => dispatch(systemModalClose()),
    [dispatch],
  );

  const { message, description, confirmButton, cancelButton, callbackFunc, cancelFunc } =
    useRootState((state) => state.systemModalReducer);

  const handleComfirm = () => {
    if (callbackFunc) {
      callbackFunc();
    }
    handleSystemModalClose();
  };

  const handleCloseModal = () => {
    if (cancelFunc) {
      cancelFunc();
    }
    handleSystemModalClose();
  };

  useEffect(() => {
    history.listen(() => {
      if (history.action === 'POP') {
        handleSystemModalClose();
      }
    });
  }, [history]);

  return (
    <>
      {isOpen && (
        <div
          className="modal"
          ref={modalRef}
          style={!isOpen ? { display: 'none' } : { display: 'block' }}
        >
          <div className="modal-backdrop"></div>
          <div
            className={`modal-container ${cancelButton ? 'two-button' : 'one-button'}`}
          >
            <div className="modal-body">
              {message && message.includes('\n') ? (
                <div className={description ? `sub-title` : `text`}>
                  {message.split('\n').map((v, i) => {
                    return (
                      <>
                        {v}
                        <br />
                      </>
                    );
                  })}
                </div>
              ) : (
                <div className={description ? `sub-title` : `text`}>{message}</div>
              )}
              {description && description.includes('\n') ? (
                description.split('\n').map((v, i) => {
                  return (
                    <div className="contact" key={i}>
                      {v}
                      <br />
                    </div>
                  );
                })
              ) : (
                <div className="contact">{description}</div>
              )}
            </div>
            <div className="modal-footer">
              {cancelButton ? (
                <>
                  <button className="btn-confirm" onClick={handleComfirm}>
                    {confirmButton}
                  </button>
                  <button className="btn-close" onClick={handleCloseModal}>
                    {cancelButton && cancelButton}
                  </button>
                </>
              ) : (
                <button className="btn-confirm" onClick={handleComfirm}>
                  {confirmButton && confirmButton}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(SystemModal);
