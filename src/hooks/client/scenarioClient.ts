import { useRootState } from '@hooks/useRootState';
import { IHasResults, IScenarioModel, NODE_TYPES } from '@models';
import {
  IAnswerView,
  IBasicCardCarouselView,
  IBasicCardView,
  IConditionView,
  IGetFlowRes,
  IListCardCarouselView,
  IListCardView,
} from '@models/interfaces/res/IGetFlowRes';
import { setBasicScenarios, setSelectedScenario } from '@store/botbuilderSlice';
import { initNodes } from '@store/makingNode';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { ActionCreators } from 'redux-undo';

import { lunaToast } from '../../modules/lunaToast';
import { nodeHelper } from '../../modules/nodeHelper';
import { useHttp } from '../useHttp';

const SCENARIO_LIST = 'scenario-list';

export const useScenarioClient = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const http = useHttp();
  const { botId } = useParams();
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const arrows = useRootState((state) => state.makingNodeSliceReducer.present.arrows);
  const selectedScenario = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );

  const getScenarioList = (token: string) => {
    return useQuery<IScenarioModel[]>(
      [SCENARIO_LIST, botId],
      () =>
        http
          .post<string, AxiosResponse<IHasResults<IScenarioModel>>>(
            '/builder/getflowInfos',
            {
              sessionToken: token,
            },
          )
          .then((res) => {
            const basicScenarios: IScenarioModel[] = [];
            const scenarios = res.data.result;
            const fallbackScenario = scenarios.find((x) => x.isFallbackFlow);
            const startScenario = scenarios.find((x) => x.isStartFlow);
            if (fallbackScenario) {
              basicScenarios.push(fallbackScenario);
            }

            if (startScenario) {
              basicScenarios.push(startScenario);
            }

            dispatch(setBasicScenarios(basicScenarios));

            if (
              !selectedScenario ||
              !scenarios.find((x) => x.id === selectedScenario.id)
            ) {
              dispatch(setSelectedScenario(fallbackScenario));
            } else {
              queryClient.invalidateQueries(['scenario', selectedScenario.id]);
            }

            return scenarios
              .filter((x) => !x.isFallbackFlow && !x.isStartFlow)
              .sort((a, b) => (a.seq > b.seq ? -1 : 1));
          }),
      { refetchOnWindowFocus: false, refetchOnMount: true },
    );
  };

  const getCachedScenarioList = (botId?: string): IScenarioModel[] | undefined => {
    if (!botId) {
      return undefined;
    }
    return queryClient.getQueryData<IScenarioModel[]>(['scenario-list', botId]);
  };

  const getScenario = (token: string, scenarioId?: string) => {
    return useQuery<IGetFlowRes>(
      ['scenario', scenarioId],
      async () => {
        if (!scenarioId) {
          return [];
        }

        const res = await http.post('/builder/getflow', {
          sessionToken: token,
          flowId: scenarioId,
        });

        if (res) {
          dispatch(initNodes(res.data.result.nodes));
          dispatch(ActionCreators.clearHistory());
          return res.data.result;
        }
      },
      { refetchOnWindowFocus: false, refetchOnMount: true },
    );
  };

  const getCachedScenario = (scenarioId?: string): IGetFlowRes | undefined => {
    if (!scenarioId) {
      return undefined;
    }
    return queryClient.getQueryData<IGetFlowRes>(['scenario', scenarioId]);
  };

  const scenarioCreateMutate = useMutation(
    async ({ token, scenarioName }: { token: string; scenarioName: string }) => {
      const res = await http.post('/builder/createflow', {
        sessionToken: token,
        alias: scenarioName,
      });

      if (res) {
        queryClient.invalidateQueries(['scenario-list', botId]);
        return res;
      }
    },
  );

  const scenarioRenameMutate = useMutation(
    async ({ token, scenario }: { token: string; scenario: IScenarioModel }) => {
      const res = await http.post('/builder/renameflow', {
        sessionToken: token,
        flowId: scenario.id,
        name: scenario.alias,
      });

      if (res) {
        queryClient.invalidateQueries([SCENARIO_LIST, botId]);
        return res;
      }
    },
  );

  const scenarioActivateMutate = useMutation(
    async ({
      token,
      flowId,
      activated,
    }: {
      token: string;
      flowId: string;
      activated: boolean;
    }) => {
      const res = await http.post('/builder/activateflow', {
        sessionToken: token,
        flowId,
        activated,
      });

      if (res) {
        queryClient.invalidateQueries([SCENARIO_LIST, botId]);
        return res;
      }
    },
  );

  const scenarioDeleteMutate = useMutation(
    async ({ token, scenarioId }: { token: string; scenarioId: string }) => {
      const res = await http.post('builder/deleteflow', {
        sessionToken: token,
        flowId: scenarioId,
        isForce: false,
      });

      if (res) {
        queryClient.invalidateQueries([SCENARIO_LIST, botId]);
        return res;
      }
    },
  );

  const scenarioSaveMutate = useMutation(
    async ({ token, scenarioId }: { token: string; scenarioId: string }) => {
      const old = queryClient.getQueryData<IGetFlowRes>(['scenario', scenarioId]);
      const resultNodes = nodes.map((x) => {
        const converted = nodeHelper.convertToINodeBase(x);
        const arrow = arrows.find((a) => a.start.substring(5) === x.id);
        if (arrow) {
          converted.nextNodeId = arrow.end.substring(5);
        }

        if (converted.typeName === NODE_TYPES.BASIC_CARD_NODE && converted.view) {
          const view = converted.view as IBasicCardView;
          const buttons = view.buttons?.map((b) => {
            const buttonArrow = arrows.find((a) => a.start.substring(5) === b.id);
            return { ...b, actionValue: buttonArrow?.end.substring(5) };
          });
          converted.view = { ...view, buttons: buttons } as IBasicCardView;
        }

        if (
          converted.typeName === NODE_TYPES.BASIC_CARD_CAROUSEL_NODE &&
          converted.view
        ) {
          const carouselView = converted.view as IBasicCardCarouselView;

          const childrenViews = carouselView.childrenViews.map((view) => {
            const buttons = view.buttons?.map((b) => {
              const buttonArrow = arrows.find((a) => a.start.substring(5) === b.id);
              return { ...b, actionValue: buttonArrow?.end.substring(5) };
            });
            return { ...view, buttons };
          });

          converted.view = { ...carouselView, childrenViews } as IBasicCardCarouselView;
        }

        if (converted.typeName === NODE_TYPES.LIST_CARD_NODE && converted.view) {
          const view = converted.view as IListCardView;
          const buttons = view.buttons?.map((b) => {
            console.log(arrows);
            console.log(b.id);
            const buttonArrow = arrows.find((a) => a.start.substring(5) === b.id);
            console.log(buttonArrow);
            return { ...b, actionValue: buttonArrow?.end.substring(5) };
          });
          converted.view = { ...view, buttons: buttons } as IListCardView;
        }

        if (converted.typeName === NODE_TYPES.LIST_CAROUSEL && converted.view) {
          const carouselView = converted.view as IListCardCarouselView;

          const childrenViews = carouselView.childrenViews.map((view) => {
            const buttons = view.buttons?.map((b) => {
              const buttonArrow = arrows.find((a) => a.start.substring(5) === b.id);
              return { ...b, actionValue: buttonArrow?.end.substring(5) };
            });
            return { ...view, buttons };
          });

          converted.view = { ...carouselView, childrenViews } as IListCardCarouselView;
        }

        if (converted.typeName === NODE_TYPES.CONDITION_NODE && converted.view) {
          const view: IConditionView = converted.view;

          const trueArrow = arrows.find(
            (a) => a.start.substring(10) === `${converted.id}-true`,
          );

          const falseArrow = arrows.find(
            (a) => a.start.substring(10) === `${converted.id}-false`,
          );

          converted.view = {
            ...view,
            trueThenNextNodeId: trueArrow ? trueArrow.end.substring(5) : undefined,
            falseThenNextNodeId: falseArrow ? falseArrow.end.substring(5) : undefined,
          } as IConditionView;
        }

        if (converted.typeName === NODE_TYPES.ANSWER_NODE && converted.view) {
          const view: IAnswerView = converted.view;
          const quicks = view.quicks?.map((q) => {
            const arrow = arrows.find((a) => a.start.substring(5) === q.id);
            return { ...q, actionValue: arrow?.end.substring(5) };
          });

          converted.view = { ...view, quicks } as IAnswerView;
        }

        return converted;
      });
      const result = { ...old, nodes: resultNodes };
      // nodes.forEach((node) => {
      //   const oldNode = old?.nodes.find((x) => x.id === node.id);
      //   console.log(oldNode);
      //   console.log(node);
      //   if (oldNode) {
      //     oldNode.alias = node.title || '';
      //     oldNode.top = node.y;
      //     oldNode.left = node.x;
      //   }
      // });

      const res = await http.post('builder/updateflow', {
        sessionToken: token,
        flow: result,
      });
      if (res) {
        lunaToast.success();
        queryClient.invalidateQueries(['scenario', scenarioId]);
        return res;
      }
    },
  );

  return {
    getScenarioList,
    getCachedScenarioList,
    getScenario,
    getCachedScenario,
    scenarioCreateAsync: scenarioCreateMutate.mutateAsync,
    scenarioRenameAsync: scenarioRenameMutate.mutateAsync,
    scenarioDeleteAsync: scenarioDeleteMutate.mutateAsync,
    scenarioActiveAsync: scenarioActivateMutate.mutateAsync,
    scenarioSaveAsync: scenarioSaveMutate.mutateAsync,
  };
};
