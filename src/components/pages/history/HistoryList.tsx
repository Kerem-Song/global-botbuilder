import { icUtteranceSelectHistory } from '@assets';
import { Button } from '@components/general';
import { Col, Row } from '@components/layout';
import { usePage } from '@hooks';
import { useHistoryClient } from '@hooks/client/historyClient';
import { IHistoryCondition } from '@models';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ReactLoadingSkeleton from 'react-loading-skeleton';
import { useParams } from 'react-router';

export const HistoryListItem = ({ category, year }: IHistoryCondition) => {
  const { t } = usePage();
  // const category = '시나리오';
  const title = '시나리오 01';
  const desc = '시나리오가 생성되었습니다.';
  const { botId } = useParams();

  const { changeHistoryPageNumberQuery } = useHistoryClient();
  const { data, fetchNextPage, hasNextPage, isFetching } = changeHistoryPageNumberQuery({
    botId: botId!,
    category: category,
    year: year,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const hasPage = () => {
    if (data && data?.pages?.reduce((a, b) => a + b.totalPage, 0) > 0) {
      return true;
    }

    return false;
  };

  console.log('data.items', data?.pages[0].items);

  return (
    <div className="historyListContainter" ref={ref}>
      {hasPage() ? (
        data?.pages[0].items?.map((item, i) => (
          <Row
            className="historyListWarpper"
            justify="space-between"
            align="flex-end"
            key={i}
          >
            <Col className="historyList">
              {isFetching ? (
                <ReactLoadingSkeleton
                  count={1}
                  height={24}
                  width={96}
                  baseColor="#EDEDF0"
                />
              ) : (
                <div className="historyListCatetory">
                  <img src={icUtteranceSelectHistory} alt="categoryImage" />
                  <span>{}</span>
                </div>
              )}
              {isFetching ? (
                <ReactLoadingSkeleton
                  count={1}
                  height={24}
                  width={132}
                  baseColor="#DFE8FF"
                />
              ) : (
                <p className="historyListTitle">
                  {title}
                  <Button shape="ghost">{t(`VIEWER_BTN`)}</Button>
                </p>
              )}
              {isFetching ? (
                <ReactLoadingSkeleton
                  count={1}
                  height={24}
                  width={360}
                  baseColor="#EDEDF0"
                />
              ) : (
                <div>
                  <span className="historyListDesc">{desc}</span>
                </div>
              )}
            </Col>
            <Col className="historyDateActorWrapper">
              {isFetching ? (
                <ReactLoadingSkeleton
                  count={1}
                  height={24}
                  width={135}
                  baseColor="#EDEDF0"
                />
              ) : (
                <p>{item.createAt}</p>
              )}
              {isFetching ? (
                <ReactLoadingSkeleton
                  count={1}
                  height={24}
                  width={190}
                  baseColor="#EDEDF0"
                />
              ) : (
                <p>
                  {item.actorEmail}({item.actorName})
                </p>
              )}
            </Col>
          </Row>
        ))
      ) : (
        <ReactLoadingSkeleton count={1} height={24} width={96} baseColor="#EDEDF0" />
      )}
    </div>
  );
};
