import { icUtteranceEmpty } from '@assets';
import { usePage, useSystemModal } from '@hooks';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import { useRootState } from '@hooks/useRootState';
import { IDeleteIntent, IIntentListItem, IPagingItems, ISearchData } from '@models';
import { FC, useEffect } from 'react';
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

  const { getIntentDetailQuery, intentDeleteMutate, changePageNumberQuery } =
    useUtteranceClient();

  const { data, hasNextPage, isFetching, fetchNextPage, isSuccess, isLoading } =
    changePageNumberQuery;

  const { botId } = useParams();
  const { navigate, t, tc } = usePage();

  const token = useRootState((state) => state.botBuilderReducer.token);
  const { confirm } = useSystemModal();

  useEffect(() => {
    if (!data) {
      return;
    }

    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

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

  return (
    <>
      {data && data.pages.length > 0 ? (
        <>
          {data?.pages.map((v) => {
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
      ) : (
        <tr className="emptyList">
          <td className="empty">
            <img src={icUtteranceEmpty} alt="empty" />
            <span>No search results found.</span>
          </td>
        </tr>
      )}
    </>
  );
};
