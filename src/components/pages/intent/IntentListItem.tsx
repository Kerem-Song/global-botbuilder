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
import { useParams } from 'react-router';

import { lunaToast } from '../../../modules/lunaToast';
import { IntentSkeleton } from './IntentSkeleton';

export interface IIntentListItemProps {
  searchData: ISearchData;
  isOpenUtterancePopup: boolean;
  handleDetailPopupOpen?: (intentId: string) => void;
}

export const IntentListItem: FC<IIntentListItemProps> = ({
  searchData,
  isOpenUtterancePopup,
  handleDetailPopupOpen,
}) => {
  const { botId } = useParams();
  const { navigate } = usePage();
  const { t, tc } = useI18n('intent');
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
    isFetchedAfterMount,
  } = changePageNumberQuery(searchData);

  const handleIntent = (intentId: string) => {
    if (isOpenUtterancePopup && handleDetailPopupOpen) {
      handleDetailPopupOpen(intentId);
    } else {
      navigate(`/${botId}/intent/detail/${intentId}`);
    }
  };

  const openDeleteModal = async (intentId: string) => {
    const deleteIntentConfirm = await confirm({
      title: t('DELETE_INTENT'),
      description: <p style={{ whiteSpace: 'pre-line' }}>{t('DELETE_INTENT_MESSAGE')}</p>,
    });

    if (deleteIntentConfirm) {
      const deleteIntent: IDeleteIntent = {
        sessionToken: token,
        intentId: intentId,
      };

      const res = await intentDeleteAsync(deleteIntent);

      if (res && res.isSuccess) {
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
      className={classNames('intentTbody', {
        'intent-popup-tbody': isOpenUtterancePopup,
      })}
    >
      {isFetching && !isFetchedAfterMount && (
        <IntentSkeleton isOpenUtterancePopup={isOpenUtterancePopup} />
      )}
      {isFetchedAfterMount && isExistInitialData(initialData)
        ? initialData?.pages.map((v) => {
            const pages = v.items;
            return pages.map((x, i) => {
              const foundFlow = data?.find((item) => item.id === x.flowId);
              const inactivatedFlow = foundFlow && !foundFlow.activated;
              const showScenarioList = !isOpenUtterancePopup;
              return (
                <tr
                  key={i}
                  ref={ref}
                  className="intentTbodyTr"
                  onClick={() => handleIntent(x.intentId)}
                >
                  <td
                    role="presentation"
                    className={classNames('intentList intent', {
                      hiddenScenarioListIntent: !showScenarioList,
                    })}
                  >
                    <span className="intentName">
                      {searchData?.searchWord
                        ? util.replaceKeywordMark(x.intentName, searchData?.searchWord)
                        : x.intentName}
                    </span>
                  </td>
                  {showScenarioList ? (
                    <td
                      role="presentation"
                      className={classNames('intentList connectScenarios', {
                        connectScenariosInactivated: inactivatedFlow,
                      })}
                    >
                      <span className="flowName">
                        {x.flowName === null ? '-' : x.flowName}
                      </span>
                    </td>
                  ) : null}
                  <td
                    role="presentation"
                    className={classNames('intentList utterance', {
                      hiddenScenarioListUtterance: !showScenarioList,
                    })}
                  >
                    <span className="utteranceItems">
                      {searchData?.searchWord
                        ? util.replaceKeywordMark(
                            x.utteranceSummary,
                            searchData?.searchWord,
                          )
                        : x.utteranceSummary}
                    </span>
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
