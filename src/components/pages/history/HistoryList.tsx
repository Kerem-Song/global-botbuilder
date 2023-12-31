import { icNoResult } from '@assets';
import { Button } from '@components/general';
import { Col, Row } from '@components/layout';
import { usePage, useRootState } from '@hooks';
import { useHistoryClient } from '@hooks/client/historyClient';
import {
  IHistoryCondition,
  IHistoryProperty,
  IHistoryValueMatch,
  IResponseHistoryItem,
} from '@models';
import { util } from '@modules/util';
import { setHistoryInfo, setHistoryYearSelector } from '@store/historyInfoSlice';
import { useEffect } from 'react';
import { Trans } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import ReactLoadingSkeleton from 'react-loading-skeleton';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { HistoryValue } from './HistoryValue';
interface IReactSelect {
  value: string | null;
  label: string;
}
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
  const [ref, inView] = useInView();
  const brandInfo = useRootState((state) => state.brandInfoReducer);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  const hasPage = () => {
    if (data && data?.pages?.reduce((a, b) => a + b.totalPage, 0) > 0) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (data) {
      const yearArr = data?.pages[0].items?.map((v) =>
        new Date(v.createAt).getFullYear(),
      );
      const setYear = new Set(yearArr);
      const uniqueYear: IReactSelect[] = [...setYear]
        .map((year: number) => ({
          value: year.toString(),
          label: year.toString(),
        }))
        .sort((a, b) => (a > b ? -1 : 0));
      const yearOptions = [{ value: null, label: t(`ALL_YEAR`) }, ...uniqueYear];

      dispatch(setHistoryYearSelector(yearOptions));
    }
  }, [data]);

  const { historyValArr } = HistoryValue();

  const matchCategory = (item: IResponseHistoryItem) => {
    const matched: IHistoryValueMatch[] = historyValArr.filter(
      (v) => v.changeLogType === item.changeLogType,
    );
    const categoryLabel = matched.map((val) => val.categoryLabel);

    const categoryValue = matched.map((val) => val.categoryValue);

    const categoryChangeLogType = matched.map((val) => val.changeLogType);

    const property = matched.map(
      (val) => Object.values(val.property)[0],
    )[0] as keyof IHistoryProperty;

    const secondProperty = matched.map((val) =>
      Object.keys(val.property),
    )[0][1] as keyof IHistoryProperty;

    const description = matched.map((val, i) => {
      const firstParam = item[property];
      let secondParam = item[secondProperty];

      // 연결/해제, 활성화/비활성화
      if (secondParam === true) {
        if (val.changeLogType === 1006 || val.changeLogType === 1007) {
          secondParam = t(`CAPTION_CONNECTED`);
        } else if (val.changeLogType === 1003 || val.changeLogType === 2005) {
          secondParam = t(`CAPTION_ACTIVATED`);
        }
      } else if (secondParam === false) {
        if (val.changeLogType === 1006 || val.changeLogType === 1007) {
          secondParam = t(`CAPTION_DISCONNECTED`);
        } else if (val.changeLogType === 1003 || val.changeLogType === 2005) {
          secondParam = t(`CAPTION_DEACTIVATED`);
        }
      } else if (secondParam === null) {
        secondParam = '-';
      }

      return (
        <Trans
          key={`CAPTION_${val.name}-${val.changeLogType}`}
          t={t}
          values={{ firstParam, secondParam }}
        >
          {`CAPTION_${val.name}`}
        </Trans>
      );
    });

    return {
      categoryLabel,
      categoryValue,
      categoryChangeLogType,
      property,
      secondProperty,
      description,
    };
  };

  const handleViewerOpen = (
    e: React.MouseEvent<HTMLButtonElement>,
    item: IResponseHistoryItem,
  ) => {
    const id = e.currentTarget.value;

    dispatch(setHistoryInfo(item));

    window.open(
      window.location.origin +
        `/${brandInfo.brandId}/${botId}/viewer/${id}/${util.toLocaleDateTimeString(
          new Date(item.createAtByBrand),
        )}/${item.actorEmail}/${item.actorName}/`,

      '_blank',
      `toolbar=1,location=1,menubar=1`,
    );
  };

  const handleHistoryListTitle = (item: IResponseHistoryItem) => {
    if (matchCategory(item).categoryChangeLogType.includes(1008)) {
      return t(`CAPTION_FLOWGROUPEXPORT_TITLE`);
    } else if (matchCategory(item).categoryChangeLogType.includes(1009)) {
      return t(`CAPTION_FLOWGROUPIMPORT_TITLE`);
    } else if (matchCategory(item).categoryChangeLogType.includes(4001)) {
      return t(`CAPTION_LIVE_DEPLOYMENT_CATEGORY_LABEL`);
    } else if (matchCategory(item).categoryChangeLogType.includes(4002)) {
      return t(`CAPTION_TEST_DEPLOYMENT_CATEGORY_LABEL`);
    } else {
      return item[matchCategory(item).property];
    }
  };

  return (
    <div className="historyListContainter">
      {isFetching &&
        util.range(5).map((n) => (
          <div key={n}>
            <Row className="historyListWarpper" justify="space-between" align="flex-end">
              <Col className="historyList">
                <ReactLoadingSkeleton
                  count={1}
                  height={24}
                  width={96}
                  baseColor="#EDEDF0"
                />{' '}
                <ReactLoadingSkeleton
                  count={1}
                  height={24}
                  width={132}
                  baseColor="#DFE8FF"
                />
                <ReactLoadingSkeleton
                  count={1}
                  height={24}
                  width={360}
                  baseColor="#EDEDF0"
                />
              </Col>
              <Col className="historyDateActorWrapper">
                <ReactLoadingSkeleton
                  count={1}
                  height={24}
                  width={135}
                  baseColor="#EDEDF0"
                />
                <ReactLoadingSkeleton
                  count={1}
                  height={24}
                  width={190}
                  baseColor="#EDEDF0"
                />
              </Col>
            </Row>
          </div>
        ))}
      {hasPage() ? (
        data?.pages.map((v) => {
          const pages = v.items;
          return pages.map((item) => (
            <div key={item.id} ref={ref}>
              <Row className="historyListWarpper" justify="space-between">
                <Col className="historyList">
                  <div
                    className="historyListCatetory"
                    data-img={matchCategory(item).categoryValue}
                  >
                    <span>{matchCategory(item).categoryLabel}</span>
                  </div>

                  <div className="historyListTitle">
                    <span>{handleHistoryListTitle(item)}</span>
                    {matchCategory(item).categoryChangeLogType.includes(2004) ? (
                      <Button
                        shape="ghost"
                        className="viewerBtn"
                        onClick={(e) => handleViewerOpen(e, item)}
                        value={item.id}
                      >
                        {t(`VIEWER_BTN`)}
                      </Button>
                    ) : null}
                  </div>

                  <div>
                    <span className="historyListDesc">
                      {matchCategory(item).description}
                    </span>
                  </div>
                </Col>
                <Col className="historyDateActorWrapper">
                  <p>{util.toLocaleDateTimeString(new Date(item.createAtByBrand))}</p>

                  <p className="actorInfoWrapper">
                    {item.actorEmail}({item.actorName})
                  </p>
                </Col>
              </Row>
            </div>
          ));
        })
      ) : (
        <div className="emptyList">
          <img src={icNoResult} alt="noResult" />
          <span>{t(`NO_RESULT`)}</span>
        </div>
      )}
    </div>
  );
};
