import { icSuccess, icUtteranceEmpty } from '@assets';
import { useSystemModal } from '@hooks';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import { useRootState } from '@hooks/useRootState';
import { IDeleteIntent, IIntentListItem, IPagingItems, ISearchData } from '@models';
import { FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export interface IUtteranceListItemProps {
  data: IPagingItems<IIntentListItem> | undefined;
  searchData: ISearchData;
  setSearchData: (data: ISearchData) => void;
}

export const UtteranceListItem: FC<IUtteranceListItemProps> = ({
  data,
  searchData,
  setSearchData,
}) => {
  const { intentDeleteMutate } = useUtteranceClient();
  const navigate = useNavigate();
  const token = useRootState((state) => state.botBuilderReducer.token);
  const { confirm } = useSystemModal();

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
          const message = '삭제되었습니다.';
          toast.success(message, {
            position: 'bottom-right',
            icon: () => <img src={icSuccess} alt="success" />,
            theme: 'dark',
            hideProgressBar: true,
            className: 'luna-toast',
            bodyClassName: 'luna-toast-body',
          });
        },
      });
    }
  };

  return (
    <>
      {data?.items && data?.items.length > 0 ? (
        data?.items.map((v, i) => {
          return (
            <tr key={i} className="list">
              <td
                role="presentation"
                className="utteranceList intent"
                onClick={() => navigate(':utteranceId')}
              >
                {v.intentName}
              </td>
              <td className="utteranceList connectScenarios">{v.flowName}</td>
              <td className="utteranceList utterance">{v.utteranceSummary}</td>
              <td className="utteranceList icon">
                <button
                  className="icDelete"
                  onClick={() => openModal(v.flowName, v.intentId)}
                />
              </td>
            </tr>
          );
        })
      ) : (
        <tr className="emptyList">
          <td className="empty">
            <img src={icUtteranceEmpty} alt="empty" />
            <span>No search results found.</span>
          </td>
        </tr>
      )}
      {/* {data?.items
        .filter((x) => x.utteranceSummary.includes(searchKeyword))
        .map((utterance, i) => {
          return (
            <tr key={i} className="emptyList">
              <td className="empty">
                <img src={icUtteranceEmpty} alt="empty" />
                <span>No search results found.</span>
              </td>
            </tr>
          );
        })} */}
      {/* <>
        {data?.items.filter((x) => x !== searchData) ? (
          <tr className="emptyList">
            <td className="empty">
              <img src={icUtteranceEmpty} alt="empty" />
              <span>No search results found.</span>
            </td>
          </tr>
        ) : null}
      </> */}
    </>
  );
};
