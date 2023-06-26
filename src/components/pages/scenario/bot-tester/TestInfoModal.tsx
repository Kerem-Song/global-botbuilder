import { Col } from '@components/layout';
import { useI18n, useRootState } from '@hooks';
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
  const { t } = useI18n('botTest');
  const useTextFunction =
    useRootState((state) => state.userInfoReducer.companyName) === '비즈챗봇팀';
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
              {useTextFunction ? (
                <div className="info">
                  <div className="infoText">
                    {debugMeta.flowAlias}의 ID : {debugMeta.nodeId}
                  </div>
                </div>
              ) : null}
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
