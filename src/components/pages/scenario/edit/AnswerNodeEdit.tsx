import { Button, Input, Switch } from '@components';
import { Divider, Space } from '@components/layout';
import classnames from 'classnames';
import { useController, useFormContext } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

const answerNodeTypeOptions = [
  { value: 'message', label: 'message' },
  { value: 'block', label: 'block' },
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
      color: 'black',
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
    borderRadius: '2px',
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
            <div className={classnames('input', { 'disabled ': !values.view.allowRes })}>
              <Input
                {...register(`view.extra`)}
                value={values.view?.extra || ''}
                placeholder="변수명을 입력해주세요"
                disabled={!values.view.allowRes}
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
