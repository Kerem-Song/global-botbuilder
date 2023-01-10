import { Col } from '@components/layout';
import { ITesterDebugMeta } from '@models';

export interface ITestInfoModalProps {
  isOpen: boolean;
  handleClose: () => void;
  debugMeta: ITesterDebugMeta;
}

export const TestInfoModal = ({
  isOpen,
  handleClose,
  debugMeta,
}: ITestInfoModalProps) => {
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
                <div className="infoText">{debugMeta.flowAlias}</div>
              </div>
              <div className="info">
                <div className="infoName">Chatbubble name</div>
                <div className="infoText">{debugMeta.nodeAlias}</div>
              </div>
            </Col>
          </Col>
        </div>
      )}
    </>
  );
};
