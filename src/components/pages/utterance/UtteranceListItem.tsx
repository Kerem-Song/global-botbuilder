import { icNoResult } from '@assets';
import { useI18n, usePage, useSystemModal } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import { useRootState } from '@hooks/useRootState';
import { IDeleteIntent, IIntentListItem, IPagingItems, ISearchData } from '@models';
import { util } from '@modules/util';
import { InfiniteData } from '@tanstack/react-query';
import classNames from 'classnames';
import { FC, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import MultiClamp from 'react-multi-clamp';
import { useParams } from 'react-router';

import { lunaToast } from '../../../../src/modules/lunaToast';
import { UtteranceSkeleton } from './UtteranceSkeleton';

export interface IUtteranceListItemProps {
  searchData: ISearchData;
  isOpenUtterancePopup: boolean;
  handleDetailPopupOpen?: (intentId: string) => void;
}

export const UtteranceListItem: FC<IUtteranceListItemProps> = ({
  searchData,
  isOpenUtterancePopup,
  handleDetailPopupOpen,
}) => {
  const { botId } = useParams();
  const { navigate } = usePage();
  const { t, tc } = useI18n('utterance');

  const [ref, inView] = useInView();
  const token = useRootState((state) => state.botInfoReducer.token);
  const { confirm } = useSystemModal();
  const { intentDeleteAsync, changePageNumberQuery } = useUtteranceClient();
  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();
  const selectedScenarios = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );
  const { sort, scenarios, searchWord } = searchData;
  const defaultSearchData = sort === 1 && scenarios === 'all' && searchWord === undefined;
  const hasFlowIdSearchData =
    sort === 1 && scenarios === selectedScenarios?.id && searchWord === undefined;
  const {
    data: initialData,
    fetchNextPage,
    isFetching,
  } = changePageNumberQuery(searchData);

  const handleIntent = (intentId: string) => {
    if (isOpenUtterancePopup && handleDetailPopupOpen) {
      handleDetailPopupOpen(intentId);
    } else {
      navigate(`/${botId}/utterance/detail/${intentId}`);
    }
  };

  const openDeleteModal = async (intentId: string) => {
    const result = await confirm({
      title: t('DELETE_INTENT'),
      description: <p style={{ whiteSpace: 'pre-wrap' }}>{t('DELETE_INTENT_MESSAGE')}</p>,
    });

    if (result) {
      const deleteIntent: IDeleteIntent = {
        sessionToken: token,
        intentId: intentId,
      };

      const res = await intentDeleteAsync(deleteIntent);

      if (res && res.isSuccess) {
        console.log(res);
        lunaToast.success(tc('DELETE_MESSAGE'));
      }
    }
  };

  const isExistInitialData = (
    data: InfiniteData<IPagingItems<IIntentListItem>> | undefined,
  ): boolean => {
    if (data?.pages && data?.pages?.reduce((acc, cur) => acc + cur.totalPage, 0) > 0) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!initialData) {
      return;
    }

    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <tbody
      className={classNames('utteranceTbody', {
        'utterance-popup-tbody': isOpenUtterancePopup,
      })}
    >
      {isFetching && <UtteranceSkeleton isOpenUtterancePopup={isOpenUtterancePopup} />}
      {!isFetching && isExistInitialData(initialData)
        ? initialData?.pages.map((v) => {
            const pages = v.items;
            return pages.map((x, i) => {
              const foundFlow = data?.find((item) => item.id === x.flowId);
              const inactivatedFlow = foundFlow && foundFlow.activated === false;
              const showScenarioList = isOpenUtterancePopup === false;
              return (
                <tr
                  key={i}
                  ref={ref}
                  className="utteranceTbodyTr"
                  onClick={() => handleIntent(x.intentId)}
                >
                  <td
                    role="presentation"
                    className={classNames('utteranceList intent', {
                      'hidden-scenarioList': !showScenarioList,
                    })}
                  >
                    {searchData?.searchWord
                      ? util.replaceKeywordMark(x.intentName, searchData?.searchWord)
                      : x.intentName}
                  </td>
                  {showScenarioList ? (
                    <td
                      role="presentation"
                      className={classNames('utteranceList connectScenarios', {
                        'connectScenarios-inactivated': inactivatedFlow,
                      })}
                    >
                      {x.flowName === null ? '-' : x.flowName}
                    </td>
                  ) : null}
                  <td
                    role="presentation"
                    className={classNames('utteranceList utterance', {
                      'hidden-scenarioList-utterance': !showScenarioList,
                    })}
                  >
                    <MultiClamp clamp={1} ellipsis={'...'}>
                      {searchData?.searchWord
                        ? util.replaceKeywordMark(
                            x.utteranceSummary,
                            searchData?.searchWord,
                          )
                        : x.utteranceSummary}
                    </MultiClamp>
                  </td>
                  <td className="icon">
                    <button
                      className="icDelete"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(x.intentId);
                      }}
                    />
                  </td>
                </tr>
              );
            });
          })
        : !isFetching &&
          initialData?.pages[0].items.length === 0 && (
            <tr className="emptyList popup">
              <td className="empty">
                <img src={icNoResult} alt="empty" />
                {selectedScenarios?.id === undefined ? (
                  <span>
                    {!defaultSearchData
                      ? t('NO_SEARCH_RESULT_FOUND')
                      : t('NO_REGISTERED_INTENT')}
                  </span>
                ) : (
                  <span>
                    {!hasFlowIdSearchData
                      ? t('NO_SEARCH_RESULT_FOUND')
                      : t('NO_REGISTERED_INTENT')}
                  </span>
                )}
              </td>
            </tr>
          )}
    </tbody>
  );
};
