import { icNoResult } from '@assets';
import { Col, Row } from '@components';
import { usePage, useSystemModal } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import { useRootState } from '@hooks/useRootState';
import { IDeleteIntent, IIntentListItem, IPagingItems, ISearchData } from '@models';
import { util } from '@modules/util';
import { InfiniteData } from '@tanstack/react-query';
import classNames from 'classnames';
import { FC, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ReactLoadingSkeleton from 'react-loading-skeleton';
import { useParams } from 'react-router';

import { lunaToast } from '../../../../src/modules/lunaToast';

export interface IUtteranceListItemProps {
  searchData?: ISearchData;
}

export const UtteranceListItem: FC<IUtteranceListItemProps> = ({ searchData }) => {
  const { botId } = useParams();
  const { navigate, t, tc } = usePage();
  const [ref, inView] = useInView();
  const token = useRootState((state) => state.botInfoReducer.token);
  const { confirm } = useSystemModal();
  const { intentDeleteMutate, changePageNumberQuery } = useUtteranceClient();
  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();

  const {
    data: initialData,
    fetchNextPage,
    isFetching,
  } = changePageNumberQuery(searchData!);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const handleGetIntent = (intentId: string) => {
    navigate(`/${botId}/utterance/detail/${intentId}`);
  };

  const openModal = async (intentId: string) => {
    const result = await confirm({
      title: t('DELETE_INTENT'),
      description: <p style={{ whiteSpace: 'pre-wrap' }}>{t('DELETE_INTENT_MESSAGE')}</p>,
    });

    if (result) {
      const deleteIntent: IDeleteIntent = {
        sessionToken: token!,
        intentId: intentId,
      };
      intentDeleteMutate.mutate(deleteIntent, {
        onSuccess: (submitResult) => {
          console.log(submitResult);
          lunaToast.success(tc('DELETE_MESSAGE'));
        },
      });
    }
  };

  const isExistInitialData = (
    data: InfiniteData<IPagingItems<IIntentListItem>> | undefined,
  ): boolean => {
    if (!data) {
      return true;
    }
    if (data?.pages && data?.pages?.reduce((acc, cur) => acc + cur.totalPage, 0) > 0) {
      return true;
    }
    return false;
  };

  return (
    <>
      {!initialData || isFetching ? (
        <>
          {util.range(5).map((n) => (
            <tr className="list" key={n}>
              <td role="presentation" className="utteranceList intent">
                <ReactLoadingSkeleton
                  count={1}
                  height={16}
                  width={`${util.random(100)}%`}
                  baseColor="rgba(0,0,0,0.06)"
                  style={{ lineHeight: 2 }}
                />
              </td>
              <td role="presentation" className="utteranceList connectScenarios">
                <ReactLoadingSkeleton
                  count={1}
                  height={16}
                  width={`50%`}
                  baseColor="rgba(0,0,0,0.06)"
                  style={{ lineHeight: 2 }}
                />
              </td>
              <td role="presentation" className="utteranceList utterance">
                <Row gap={10}>
                  <Col span={util.random(8)}>
                    <ReactLoadingSkeleton
                      count={1}
                      height={16}
                      baseColor="rgba(0,0,0,0.06)"
                      style={{ lineHeight: 2 }}
                    />
                  </Col>
                  <Col span={util.random(8)}>
                    <ReactLoadingSkeleton
                      count={1}
                      height={16}
                      baseColor="rgba(0,0,0,0.06)"
                      style={{ lineHeight: 2 }}
                    />
                  </Col>
                  <Col span={util.random(8)}>
                    <ReactLoadingSkeleton
                      count={1}
                      height={16}
                      baseColor="rgba(0,0,0,0.06)"
                      style={{ lineHeight: 2 }}
                    />
                  </Col>
                </Row>
              </td>
              <td className="utteranceList icon"></td>
            </tr>
          ))}
        </>
      ) : (
        <></>
      )}
      {isExistInitialData(initialData) ? (
        initialData?.pages.map((v) => {
          const pages = v.items;
          return pages.map((x, i) => {
            const foundFlow = data?.find((item) => item.id === x.flowId);
            const connectedFlow = x.flowName !== null;
            const notFoundFlow = foundFlow === undefined;
            const hasInactiveFlow = connectedFlow && notFoundFlow;
            return (
              <tr
                key={i}
                className="list"
                ref={ref}
                onClick={() => handleGetIntent(x.intentId)}
              >
                <td role="presentation" className="utteranceList intent">
                  {searchData?.searchWord
                    ? util.replaceKeywordMark(x.intentName, searchData?.searchWord)
                    : x.intentName}
                </td>
                <td
                  role="presentation"
                  className={classNames('utteranceList connectScenarios', {
                    'connectScenarios-notActivated': hasInactiveFlow,
                  })}
                >
                  {x.flowName === null ? '-' : x.flowName}
                </td>
                <td role="presentation" className="utteranceList utterance">
                  {searchData?.searchWord
                    ? util.replaceKeywordMark(x.utteranceSummary, searchData?.searchWord)
                    : x.utteranceSummary}
                </td>
                <td className="utteranceList icon">
                  <button
                    className="icDelete"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(x.intentId);
                    }}
                  ></button>
                </td>
              </tr>
            );
          });
        })
      ) : (
        <tr className="emptyList">
          <td className="empty">
            <img src={icNoResult} alt="empty" />
            {searchData?.searchWord ? (
              <span>{t('NO_SEARCH_INTENT_RESULT_FOUND')}</span>
            ) : (
              <span>{t('NO_REGISTERED_INTENT')}</span>
            )}
          </td>
        </tr>
      )}
    </>
  );
};
