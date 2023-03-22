import { Button } from '@components/general';
import { Col, Row } from '@components/layout';
import { usePage } from '@hooks';

export const HistoryListItem = () => {
  const { t } = usePage();
  return (
    <Row className="historyListWarpper">
      <Col className="historyList">
        <p className="historyListCatetory">{}</p>
        <p className="historyListTitle">
          {}
          <Button shape="ghost">{t(`VIEWER_BTN`)}</Button>
        </p>
        <div>
          <span className="historyListDesc"></span>
        </div>
      </Col>
      <Col className="historyDateActorWrapper">
        <p>{}</p>
        <p>{}</p>
      </Col>
    </Row>
  );
};
