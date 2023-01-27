import { icUtteranceEmpty } from '@assets';
import { useSystemModal } from '@hooks';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import { useRootState } from '@hooks/useRootState';
import { IDeleteIntent } from '@models';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

export const UtteranceListItem = () => {
  const { data, intentDeleteMutate } = useUtteranceClient();
  const [searchKeyword, setSearchKeyword] = useState('');
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
      console.log('deleteIntent', deleteIntent);
      intentDeleteMutate.mutate(deleteIntent, {
        onSuccess: (submitResult) => {
          console.log(submitResult);
        },
      });
    }
  };

  return (
    <>
      {data?.items ? (
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
            <span>No registered intents.</span>
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
    </>
  );
};
