import { Col } from '@components/layout';
import { ITesterDebugMeta } from '@models';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('botTest');
  return (
    <>
      {isOpen && (
        <div className="testInfoModal">
          <Col className="testInfoHeader">
            <p className="headerName">{t('DEBUG_HEADER')}</p>
            <button onClick={handleClose} className="closeBtn" />
          </Col>
          <Col className="testInfoContents">
            <Col className="testInfo">
              <div className="info">
                <div className="infoName">{t('SCENARIO_NAME')}</div>
                <div className="infoText">{debugMeta.flowAlias}</div>
              </div>
              <div className="info">
                <div className="infoName">{t('CHATBUBBLE_NAME')}</div>
                <div className="infoText">{debugMeta.nodeAlias}</div>
              </div>
            </Col>
          </Col>
        </div>
      )}
    </>
  );
};
