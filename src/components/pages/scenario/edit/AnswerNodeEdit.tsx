import { Button, FormItem, Input, Switch } from '@components';
import { Divider, Space } from '@components/layout';
import { useScenarioClient } from '@hooks';
import { IGNodeEditModel } from '@models';
import { IAnswerView } from '@models/interfaces/res/IGetFlowRes';
import classnames from 'classnames';
import { useEffect, useState } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router';

import { ButtonCtrlSelector } from './ButtonCtrlSelector';

export const AnswerNodeEdit = () => {
  const {
    register,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IAnswerView>>();
  const values = getValues();
  console.log('value.view', values.view);

  const { fields, append, remove } = useFieldArray({
    name: `view.quicks`,
    control,
  });

  // const { field: answerNodeTypeField } = useController({
  //   name: `view.action`,
  //   control,
  // });

  // const { field: scenarioField } = useController({
  //   name: `view.connectedScenario`,
  //   control,
  // });

  return (
    <>
      <div className="node-item-wrap">
        <div className="m-b-8">
          <Space direction="vertical">
            <Space direction="horizontal" style={{ alignItems: 'center' }}>
              <span className="label">사용자 응답 받기</span>
              <Switch />
            </Space>
            <Divider />
            <div>
              <span>변수 설정</span>
              <span className="required">*</span>
            </div>
            <div
              className={classnames('input', {
                // 'disabled ': !values.view?.useUtteranceParam,
              })}
            >
              <Input
                {...register(`view.utteranceParam`)}
                placeholder="변수명을 입력해주세요"
                // disabled={!values.view?.useUtteranceParam}
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
        {fields.map((item, i) => (
          <Space direction="vertical" key={item.id}>
            <Space direction="vertical">
              <div className="m-b-8">
                <Space direction="vertical">
                  <div>
                    <span className="label">퀵 버튼 이름 </span>
                    <span className="required">*</span>
                  </div>
                  <FormItem
                    error={
                      errors.view && errors.view.quicks && errors.view.quicks[i]?.label
                    }
                  >
                    <Input {...register(`view.quicks.${i}.label`)} />
                  </FormItem>
                </Space>
              </div>
              <div>
                <span className="label">퀵 버튼 타입 </span>
                <span className="required">*</span>
              </div>
              <ButtonCtrlSelector name={`view.quicks.${i}.actionType`} />
            </Space>
          </Space>
        ))}

        <div className="m-b-8">
          {/* <Space direction="vertical">
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
          </Space> */}
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
