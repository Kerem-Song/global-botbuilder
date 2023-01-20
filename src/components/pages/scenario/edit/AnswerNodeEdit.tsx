import { Button, Input, Switch } from '@components';
import { Divider, Space } from '@components/layout';
import { useScenarioClient } from '@hooks';
import { IScenarioModel } from '@models';
import classnames from 'classnames';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router';
import Select, { StylesConfig } from 'react-select';

interface IReactSelect {
  value: string;
  label: string;
}
const answerNodeTypeOptions = [
  { value: 'block', label: 'Connecting the Chat Bubble' },
  { value: 'block', label: 'Connecting the Scenario' },
  { value: 'linkWebUrl', label: 'Connecting the URL' },
  { value: 'messageText', label: 'Type a message' },
  { value: 'operator', label: 'Connect to a counselor' },
];

const reactSelectStyle: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    alignItems: 'center',
    borderRadius: '8px',
    border: '1px solid #DCDCDC',
    borderColor: state.isFocused ? '#6b4eff' : '#e7e7e7',
    fontSize: '13px',
    width: '236px',
    ':hover': {
      borderColor: '#e7e7e7',
    },
    minHeight: '34px',
  }),

  dropdownIndicator: () => ({
    color: '#B5B4B4',
  }),
  indicatorsContainer: () => ({}),
  valueContainer: (provided) => ({
    ...provided,
    alignItems: 'center',
  }),
  placeholder: (provided) => ({
    ...provided,
    whiteSpace: 'nowrap',
    color: '#000',
  }),
  input: (provided) => ({
    ...provided,
    color: 'transparent',
    textShadow: '0 0 0 black',
  }),
  option: (provided) => ({
    ...provided,
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',

    padding: '6px 10px',
    fontSize: '13px',
    fontWeight: 400,
    color: '#757575',
    lineHeight: 1.5,
    backgroundColor: 'white',
    ':hover': {
      color: '#222222',
      backgroundColor: '#ECF2FF',
      borderRadius: '6px',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: '13px',
    color: '#222222',
    overflow: 'unset',
    textOverflow: 'unset',
  }),
  menu: (provided) => ({
    ...provided,
    border: '1px solid #DCDCDC',
    borderRadius: '8px',
  }),
};

export const AnswerNodeEdit = () => {
  const { register, getValues, control } = useFormContext();
  const values = getValues();
  console.log('value.view', values.view);

  const { field: allowResField } = useController({
    name: `view.allowRes`,
    control,
  });

  const { field: answerNodeTypeField } = useController({
    name: `view.action`,
    control,
  });

  const { field: scenarioField } = useController({
    name: `view.connectedScenario`,
    control,
  });

  const [scenarioList, setScenarioList] = useState<IReactSelect[]>([]);
  const { botId } = useParams();
  const { getCachedScenarioList } = useScenarioClient();
  const data = getCachedScenarioList(botId);

  useEffect(() => {
    if (data) {
      setScenarioList(data?.map((item) => ({ value: item.alias, label: item.alias })));
    }
  }, [data]);

  return (
    <>
      <div className="node-item-wrap">
        <div className="m-b-8">
          <Space direction="vertical">
            <Space direction="horizontal" style={{ alignItems: 'center' }}>
              <span className="label">사용자 응답 받기</span>
              <Switch {...allowResField} />
            </Space>
            <Divider />
            <div>
              <span>변수 설정</span>
              <span className="required">*</span>
            </div>
            <div className={classnames('input', { 'disabled ': !values.view?.allowRes })}>
              <Input
                {...register(`view.extra`)}
                value={values.view?.extra || ''}
                placeholder="변수명을 입력해주세요"
                disabled={!values.view?.allowRes}
              />
            </div>
          </Space>
        </div>
      </div>
      <div className="node-item-wrap">
        <div className="m-b-8">
          <Space style={{ alignItems: 'center' }}>
            <span className="label">조건 설정</span>
          </Space>
          <Divider />
        </div>
        <div className="m-b-8">
          <Space direction="vertical">
            <div>
              <span className="label">퀵 버튼 이름 </span>
              <span className="required">*</span>
            </div>
            <Input {...register(`view.label`)} value={values.view?.label || ''} />
          </Space>
        </div>
        <div className="m-b-8">
          <Space direction="vertical">
            <div>
              <span className="label">퀵 버튼 타입 </span>
              <span className="required">*</span>
            </div>
            <Select
              {...answerNodeTypeField}
              options={answerNodeTypeOptions}
              styles={reactSelectStyle}
              defaultValue={answerNodeTypeOptions[0]}
              value={answerNodeTypeOptions.find(
                (item) => item.value === answerNodeTypeField.value,
              )}
              onChange={(options: any) => answerNodeTypeField.onChange(options?.value)}
            />
            {values.view.action === 'block' && (
              <Select
                {...scenarioField}
                options={scenarioList}
                styles={reactSelectStyle}
                defaultValue={scenarioList[0]}
                value={scenarioList.find((item) => item.value === scenarioField.value)}
                onChange={(options: any) => scenarioField.onChange(options?.value)}
              />
            )}
            {values.view.action === 'linkWebUrl' && (
              <Space direction="vertical">
                <div>
                  <span className="label">URL 입력 </span>
                  <span className="required">*</span>
                </div>
                <Input {...register(`view.url`)} value={values.view?.url || ''} />
              </Space>
            )}
            {values.view.action === 'messageText' && (
              <Space direction="vertical">
                <div>
                  <span className="label">메세지 입력 </span>
                  <span className="required">*</span>
                </div>
                <Input
                  {...register(`view.messageText`)}
                  value={values.view?.messageText || ''}
                />
              </Space>
            )}
          </Space>
        </div>
        <div className="m-b-8">
          <Button shape="ghost" className="addBtn">
            + Add a Quick Reply
          </Button>
        </div>
      </div>
    </>
  );
};
