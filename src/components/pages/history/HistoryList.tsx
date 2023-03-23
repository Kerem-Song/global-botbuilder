import { icUtteranceSelectHistory } from '@assets';
import { Button } from '@components/general';
import { Col, Row } from '@components/layout';
import { usePage } from '@hooks';
import { useHistoryClient } from '@hooks/client/historyClient';
import { useParams } from 'react-router';

export const HistoryListItem = () => {
  const { t } = usePage();
  const category = '시나리오';
  const title = '시나리오 01';
  const desc = '시나리오가 생성되었습니다.';
  const testArr = [1, 2, 3];
  const { botId } = useParams();
  const { getHistoryListQuery, changeHistoryPageNumberQuery } = useHistoryClient();
  getHistoryListQuery({
    botId: botId!,
    pageNo: 1,
  });
  // console.log('@@history list:', items);
  return (
    <div className="historyListContainter">
      {testArr.map((item, i) => (
        <Row
          className="historyListWarpper"
          justify="space-between"
          align="flex-end"
          key={i}
        >
          <Col className="historyList">
            <div className="historyListCatetory">
              <img src={icUtteranceSelectHistory} alt="categoryImage" />
              <span>{category}</span>
            </div>
            <p className="historyListTitle">
              {title}
              <Button shape="ghost">{t(`VIEWER_BTN`)}</Button>
            </p>
            <div>
              <span className="historyListDesc">{desc}</span>
            </div>
          </Col>
          <Col className="historyDateActorWrapper">
            <p>{'2022-03-23 14:45:01'}</p>
            <p>{'luna@lunasoft.co.kr (Luna)'}</p>
          </Col>
        </Row>
      ))}
    </div>
  );
};
