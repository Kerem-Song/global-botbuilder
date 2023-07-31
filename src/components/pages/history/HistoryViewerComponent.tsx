import { yupResolver } from '@hookform/resolvers/yup';
import { useRootState, useYupValidation } from '@hooks';
import { useHistoryClient } from '@hooks/client/historyClient';
import { INodeEditModel } from '@models';
import { setSelectedScenario } from '@store/botbuilderSlice';
import { initNodes } from '@store/makingNode';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { ActionCreators } from 'redux-undo';

import { Botbuilder } from '../scenario/BotBuilder';
import { NodeEditDrawer } from '../scenario/edit/NodeEditDrawer';

export const HistoryViewerComponent = () => {
  const dispatch = useDispatch();
  const { botId, historyId } = useParams();
  const { getFlowSnapShot } = useHistoryClient();
  const { data } = getFlowSnapShot({ botId: botId!, historyId: historyId! });
  console.log('@history data', data);
  useEffect(() => {
    if (!data) {
      return;
    }
    dispatch(setSelectedScenario(data.result));
    dispatch(initNodes(data.result.nodes));
    dispatch(ActionCreators.clearHistory());
  }, [data]);

  const { schema } = useYupValidation();
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const selected = useRootState((state) => state.botBuilderReducer.selected);
  const selectedNode = nodes.find((x) => x.id === selected);
  console.log('@selected', nodes);
  const formMethods = useForm<INodeEditModel>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      ...selectedNode,
      title: undefined,
      view: { id: undefined, typeName: undefined },
    },
    resolver: yupResolver(schema),
  });

  return (
    <div className="scenarioWrapper">
      <div className="botBuilderWrapper">
        <Botbuilder />
        <FormProvider {...formMethods}>
          <form onSubmit={(e) => e.preventDefault()}>
            <NodeEditDrawer />
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
