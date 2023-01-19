import { Button } from '@components/general';

export interface AlertModalProps {
  isOpenAlert: boolean;
  closeAlert: () => void;
}

export const AlertModal = ({ isOpenAlert, closeAlert }: AlertModalProps) => {
  return (
    <>
      {isOpenAlert && (
        <div className="alertModalWrap">
          <div className="modalTitle">
            <span className="title">Delete</span>
          </div>
          <div className="modalText">
            <span>
              There is a scenario associated with scenario 02
              <br />: Start, Scenario 01
              <br />
              Are you sure you want to delete it?
            </span>
          </div>
          <div className="modalButtons">
            <Button className="btn" onClick={closeAlert}>
              Cancel
            </Button>
            <Button className="btn" type="primary" onClick={closeAlert}>
              Confirm
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
