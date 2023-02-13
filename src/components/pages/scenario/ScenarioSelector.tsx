import { Input } from '@components/data-entry';
import { useRootState, useScenarioClient } from '@hooks';
import { IScenarioModel } from '@models';
import { GuideInfo } from '@store/botbuilderSlice';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

interface IScenarioSelectorFormValue {
  scenarioList: IScenarioModel[];
}

interface IScenarioSelectorProps {
  popUpPosition: { x: number; y: number };
  start: GuideInfo;
}

export const ScenarioSelector = ({ children }: any) => {
  const [userInput, setUserInput] = useState<string | null>(null);
  const scenarioSelectorRef = useRef<HTMLDivElement | null>(null);
  const token = useRootState((state) => state.botBuilderReducer.token);
  const { getScenarioList } = useScenarioClient();
  const { data } = getScenarioList();
  const [scenarioList, setScenarioList] = useState<IScenarioModel[] | undefined>(data);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<IScenarioSelectorFormValue>();

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
    console.log('input', input);
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

      <div className={scenarioResult}>
        {/* {scenarioList ? (
          scenarioList?.map((item, i) => (
            <div key={i} role="presentation" data-nodename={item.alias}>
              <Row justify="flex-start" align="center" gap={8} className="btnRow">
                <Col>
                  <Button className={`icon ${item.id}`} />
                </Col>
                <Col>
                  <span className="cardType">{item.alias}</span>
                </Col>
              </Row>
            </div>
          ))
        ) : (
          <div>No Results</div>
        )} */}
        {children}
      </div>
    </div>
  );
};
