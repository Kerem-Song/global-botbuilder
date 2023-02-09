import { icSuccess, icUtteranceEmpty } from '@assets';
import { usePage, useSystemModal } from '@hooks';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import { useRootState } from '@hooks/useRootState';
import { IDeleteIntent, IIntentListItem, IPagingItems, ISearchData } from '@models';
import { FC, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useParams } from 'react-router';

import { lunaToast } from '../../../../src/modules/lunaToast';

export interface IUtteranceListItemProps {
  listData?: IPagingItems<IIntentListItem>;
  searchData?: ISearchData;
  setSearchData?: (data: ISearchData) => void;
}

export const UtteranceListItem: FC<IUtteranceListItemProps> = ({
  listData,
  searchData,
}) => {
  const [ref, inView] = useInView();
  const [isValidSearchData, setIsValidSearchData] = useState<boolean>(false);

  const { intentDeleteMutate, changePageNumberQuery } = useUtteranceClient();

  const {
    data: initialData,
    fetchNextPage,
    isSuccess,
    isLoading,
  } = changePageNumberQuery;

  const { botId } = useParams();
  const { navigate, t, tc } = usePage();

  const token = useRootState((state) => state.botBuilderReducer.token);
  const { confirm } = useSystemModal();

  useEffect(() => {
    if (!initialData) {
      return;
    }

    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    // type guard
    if (searchData !== undefined) {
      const { sort, searchWord, scenarios } = searchData;
      setIsValidSearchData(sort === 1 && !searchWord && !scenarios ? false : true);
    }
  }, [searchData]);

  const handleGetIntent = (intentId: string) => {
    navigate(`/${botId}/utterance/detail/${intentId}`);
  };

  const openModal = async (flowName: string, intentId: string) => {
    const result = await confirm({
      title: 'Delete',
      description: (
        <span>
          There is a scenario associated with scenario 02
          <br />: {flowName}
          <br />
          Are you sure you want to delete it?
        </span>
      ),
    });

    if (result) {
      const deleteIntent: IDeleteIntent = {
        sessionToken: token,
        intentId: intentId,
      };
      intentDeleteMutate.mutate(deleteIntent, {
        onSuccess: (submitResult) => {
          console.log(submitResult);
          lunaToast.success();
        },
      });
    }
  };

  if (initialData && isValidSearchData !== true) {
    return (
      <>
        {initialData?.pages.map((v) => {
          const pages = v.items;
          return pages.map((x, i) => {
            return (
              <tr key={i} className="list" ref={ref}>
                <td
                  role="presentation"
                  onClick={() => handleGetIntent(x.intentId)}
                  className="utteranceList intent"
                >
                  {x.intentName}
                </td>
                <td
                  role="presentation"
                  onClick={() => handleGetIntent(x.intentId)}
                  className="utteranceList connectScenarios"
                >
                  {x.flowName}
                </td>
                <td
                  role="presentation"
                  onClick={() => handleGetIntent(x.intentId)}
                  className="utteranceList utterance"
                >
                  {x.utteranceSummary}
                </td>
                <td className="utteranceList icon">
                  <button
                    className="icDelete"
                    onClick={() => openModal(x.flowName, x.intentId)}
                  ></button>
                </td>
              </tr>
            );
          });
        })}
      </>
    );
  } else {
    return listData?.items && listData?.items.length > 0 ? (
      <>
        {listData?.items.map((v, i) => {
          return (
            <tr key={i} className="list">
              <td
                role="presentation"
                onClick={() => handleGetIntent(v.intentId)}
                className="utteranceList intent"
              >
                {v.intentName}
              </td>
              <td
                role="presentation"
                className="utteranceList connectScenarios"
                onClick={() => handleGetIntent(v.intentId)}
              >
                {v.flowName}
              </td>
              <td
                role="presentation"
                className="utteranceList utterance"
                onClick={() => handleGetIntent(v.intentId)}
              >
                {v.utteranceSummary}
              </td>
              <td className="utteranceList icon">
                <button
                  className="icDelete"
                  onClick={() => openModal(v.flowName, v.intentId)}
                />
              </td>
            </tr>
          );
        })}
      </>
    ) : (
      <tr className="emptyList">
        <td className="empty">
          <img src={icUtteranceEmpty} alt="empty" />
          <span>No search results found.</span>
        </td>
      </tr>
    );
  }
};
