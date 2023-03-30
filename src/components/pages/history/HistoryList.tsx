import { icUtteranceSelectHistory } from '@assets';
import { Button } from '@components/general';
import { Col, Row } from '@components/layout';
import { usePage } from '@hooks';
import { useHistoryClient } from '@hooks/client/historyClient';
import {
  IHistoryCondition,
  IHistoryProperty,
  IHistoryValueMatch,
  IResponseHistoryItem,
} from '@models';
import { util } from '@modules/util';
import { setHistoryInfo } from '@store/historyInfoSlice';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ReactLoadingSkeleton from 'react-loading-skeleton';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { HistoryValue } from './HistoryValue';

export const HistoryListItem = ({ category, year }: IHistoryCondition) => {
  const { t } = usePage();
  const dispatch = useDispatch();
  const { botId } = useParams();
  const { changeHistoryPageNumberQuery } = useHistoryClient();
  const { data, fetchNextPage, hasNextPage, isFetching } = changeHistoryPageNumberQuery({
    botId: botId!,
    category: category ? category : null,
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

  const { historyValArr } = HistoryValue();
  console.log('@data:', data?.pages[0].items);
  const matchCategory = (item: IResponseHistoryItem) => {
    const matched: IHistoryValueMatch[] = historyValArr.filter(
      (v) => v.changeLogType === item.changeLogType,
    );
    const categoryLabel = matched.map((val) => val.categoryLabel);
    const categoryValue = matched.map((val) => val.categoryValue);
    const categoryChangeLotType = matched.map((val) => val.changeLogType);
    const property = matched.map(
      (val) => Object.values(val.property)[0],
    )[0] as keyof IHistoryProperty;
    const secondProperty = matched.map((val) =>
      Object.keys(val.property),
    )[0][1] as keyof IHistoryProperty;

    const desc = matched.map((val) =>
      t(`CAPTION_${val.name}`, {
        firstParam: item[property],
        secondParam: item[secondProperty],
      }),
    );
    return {
      categoryLabel,
      categoryValue,
      categoryChangeLotType,
      desc,
      property,
      secondProperty,
    };
  };

  const handleViewerOpen = (
    e: React.MouseEvent<HTMLButtonElement>,
    item: IResponseHistoryItem,
  ) => {
    const id = e.currentTarget.value;
    console.log('@item:', item);
    dispatch(setHistoryInfo(item));
    window.open(
      window.location.origin +
        `/${botId}/viewer/${id}/${util.formatDateTime(new Date(item.createUtc))}/${
          item.actorEmail
        }/${item.actorName}`,
      '_blank',
      `toolbar=1,location=1,menubar=1`,
    );
  };

  // useEffect(() => {
  //   console.log('asdf');
  // }, [handleViewerOpen]);

  return (
    <div className="historyListContainter" ref={ref}>
      {hasPage() ? (
        data?.pages[0].items?.map((item) => (
          <Row
            className="historyListWarpper"
            justify="space-between"
            align="flex-end"
            key={item.id}
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
                <div
                  className="historyListCatetory"
                  data-img={matchCategory(item).categoryValue}
                >
                  <span>{matchCategory(item).categoryLabel}</span>
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
                  {item[matchCategory(item).property]}
                  {matchCategory(item).categoryChangeLotType.includes(2004) ? (
                    <Button
                      shape="ghost"
                      className="viewerBtn"
                      onClick={(e) => handleViewerOpen(e, item)}
                      value={item.id}
                    >
                      {t(`VIEWER_BTN`)}
                    </Button>
                  ) : null}
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
                  <span className="historyListDesc">{matchCategory(item).desc}</span>
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
                <p>{util.formatDateTime(new Date(item.createUtc))}</p>
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
