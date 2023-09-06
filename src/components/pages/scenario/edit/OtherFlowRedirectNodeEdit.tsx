import { FormItem, Input } from '@components/data-entry';
import { Collapse } from '@components/general';
import { useHistoryViewerMatch, useNodeEditSave, usePage } from '@hooks';
import { useHistoryClient } from '@hooks/client/historyClient';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { IGNodeEditModel, IReactSelect, NodeOption } from '@models';
import { IOtherFlowRedirectView } from '@models/interfaces/res/IGetFlowRes';
import { getReactSelectStyle } from '@modules';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router';
import Select from 'react-select';

export const OtherFlowRedirectNodeEdit = () => {
  useNodeEditSave();
  const { t } = usePage();
  const { botId, historyId } = useParams();
  const isHistoryViewer = useHistoryViewerMatch();
  const [scenarioList, setScenarioList] = useState<IReactSelect[]>([
    { value: '', label: t(`SET_OPTION_NULL`) },
  ]);
  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();
  const {
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IOtherFlowRedirectView>>();
  const reactSelectStyle = getReactSelectStyle({});
  const { field } = useController({
    name: `nextNodeId`,
    control,
  });

  const values = getValues();

  const handleNodeHistoryViewer = () => {
    if (isHistoryViewer) {
      const { getFlowSnapShot } = useHistoryClient();
      const { data: historyData } = getFlowSnapShot({
        botId: botId!,
        historyId: historyId!,
      });
      const scenarioInHistoryViewer = historyData?.result.nodes.filter(
        (item) =>
          item.option === NodeOption.Wormhole && item.nextNodeId === values.nextNodeId,
      );

      return (
        scenarioInHistoryViewer &&
        scenarioInHistoryViewer.length &&
        scenarioInHistoryViewer.map((itemInHistory) => (
          <Input key={itemInHistory.id} value={itemInHistory.view?.otherFlowAlias} />
        ))
      );
    }
  };

  useEffect(() => {
    if (data) {
      setScenarioList([
        ...scenarioList.concat(
          data?.map((item) => ({
            value: item.firstNodeId,
            label: item.alias,
          })),
        ),
      ]);
    }
  }, [data]);

  return (
    <Collapse label={t(`OTHER_FLOW_REDIRECT_NODE_SET`)} useSwitch={true} key={values.id}>
      <div>
        <div className="m-b-12">
          <span className="subLabel">{t(`OTHER_FLOW_REDIRECT_NODE`)} </span>
          <span className="required">*</span>
        </div>
        {isHistoryViewer ? (
          handleNodeHistoryViewer()
        ) : (
          <FormItem error={errors.nextNodeId}>
            <Select
              className="react-selector"
              {...field}
              options={scenarioList}
              placeholder={t(`SET_OPTION_NULL`)}
              styles={reactSelectStyle}
              defaultValue={scenarioList.find((item) => item.value === values.nextNodeId)}
              value={scenarioList.find((item) => item.value === field.value)}
              onChange={(options: any) => field.onChange(options?.value)}
            />
          </FormItem>
        )}
      </div>
    </Collapse>
  );
};
