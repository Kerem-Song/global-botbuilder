import { Col } from '@components/layout';

export interface ITestInfoModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

export const TestInfoModal = ({ isOpen, handleClose }: ITestInfoModalProps) => {
  return (
    <>
      {isOpen && (
        <div className="testInfoModal">
          <Col className="testInfoHeader">
            <p className="headerName">Test Information</p>
            <button onClick={handleClose} className="closeBtn" />
          </Col>
          <Col className="testInfoContents">
            <Col className="testInfo">
              <div className="info">
                <div className="infoName">Scenario name</div>
                <div className="infoText">Scenario 01</div>
              </div>
              <div className="info">
                <div className="infoName">Chatbubble name</div>
                <div className="infoText">なつみ はなび おもいで まなざし ねこ</div>
              </div>
            </Col>
          </Col>
        </div>
      )}
    </>
  );
};
