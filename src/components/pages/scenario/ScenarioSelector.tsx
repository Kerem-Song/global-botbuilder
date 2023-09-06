import { Input } from '@components/data-entry';
import { useScenarioClient } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { IScenarioModel } from '@models';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

interface IScenarioSelectorFormValue {
  scenarioList: IScenarioModel[];
}

export const ScenarioSelector = ({ children }: any) => {
  const [userInput, setUserInput] = useState<string | null>(null);
  const scenarioSelectorRef = useRef<HTMLDivElement | null>(null);
  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();
  const [scenarioList, setScenarioList] = useState<IScenarioModel[] | undefined>(data);

  const { register, handleSubmit } = useForm<IScenarioSelectorFormValue>();

  const onSubmit = () => {
    if (!userInput) {
      setScenarioList(scenarioList);
    }
  };

  const onSearch = (scenarioData: string) => {
    const input = scenarioData.toLowerCase();

    const filtered = scenarioList?.filter((item) =>
      item.alias.toLowerCase().includes(input),
    );
    setScenarioList(filtered);
    setUserInput(input);

    if (!scenarioData) {
      setScenarioList(data);
    }
  };

  const scenarioResult = classNames('btnWrapper', { noResult: !scenarioList?.length });
  return (
    <div
      className="nodeLinkPopUpMenuWrapper luna-node luna-node-bordered border-radious-small"
      ref={scenarioSelectorRef}
      role="presentation"
      onWheel={(e) => e.stopPropagation()}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Input search text"
          {...register('scenarioList')}
          search
          onSearch={(data) => onSearch(data as string)}
        />
      </form>

      <div className={scenarioResult}>{children}</div>
    </div>
  );
};
