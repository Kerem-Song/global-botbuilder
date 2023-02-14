import { icUtteranceEmpty } from '@assets';
import { usePage, useSystemModal } from '@hooks';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import { useRootState } from '@hooks/useRootState';
import { IDeleteIntent, ISearchData } from '@models';
import { FC, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useParams } from 'react-router';

import { lunaToast } from '../../../../src/modules/lunaToast';

export interface IUtteranceListItemProps {
  searchData?: ISearchData;
}

export const UtteranceListItem: FC<IUtteranceListItemProps> = ({ searchData }) => {
  const { botId } = useParams();
  const { navigate, t } = usePage();
  const [ref, inView] = useInView();
  const token = useRootState((state) => state.botBuilderReducer.token);
  const { confirm } = useSystemModal();
  const { intentDeleteMutate, changePageNumberQuery } = useUtteranceClient();

  const {
    data: initialData,
    fetchNextPage,
    refetch,
    isSuccess,
    isLoading,
  } = changePageNumberQuery(searchData!);

  useEffect(() => {
    if (!initialData) {
      return;
    }

    if (inView) {
      console.log('inView');
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    if (searchData) {
      refetch({ refetchPage: (page, index) => index === 0 });
    }
  }, [searchData]);

  const handleGetIntent = (intentId: string) => {
    navigate(`/${botId}/utterance/detail/${intentId}`);
  };

  const openModal = async (intentId: string) => {
    const result = await confirm({
      title: t('DELETE_HEADER'),
      description: (
        <span>
          인텐트와 인텐트에 등록되어 있는 모든 발화가 삭제됩니다.
          <br />
          삭제하시겠습니까?
        </span>
      ),
    });

    if (result) {
      const deleteIntent: IDeleteIntent = {
        sessionToken: token!,
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

  if (initialData) {
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
                    onClick={() => openModal(x.intentId)}
                  ></button>
                </td>
              </tr>
            );
          });
        })}
      </>
    );
  } else {
    return (
      <>
        <tr className="emptyList">
          <td className="empty">
            <img src={icUtteranceEmpty} alt="empty" />
            <span>No search results found.</span>
          </td>
        </tr>
      </>
    );
  }
};
