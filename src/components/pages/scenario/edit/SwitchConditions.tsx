import { Button, Col, Divider, FormItem, Radio, Row, Space } from '@components';
import { usePage } from '@hooks';
import { ConditionJoin, IGNodeEditModel } from '@models';
import { ISwitchView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { OperatorSelector } from './OperatorSelector';
import { VariableSelector } from './VariableSelector';

export const SwitchConditions = ({ nestedIndex }: { nestedIndex: number }) => {
  const CONDITION_LIMIT = 5;
  const { t, isReadOnly } = usePage();

  const {
    watch,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<ISwitchView>>();

  const { fields, append, remove } = useFieldArray({
    name: `view.childrenViews.${nestedIndex}.items`,
    control,
  });

  const { field: joinField } = useController({
    name: `view.childrenViews.${nestedIndex}.join`,
    control,
  });

  const handleDeleteButton = (index: number) => {
    remove(index);
  };

  const handleAddConditionButton = (
    e: React.MouseEvent<HTMLLabelElement | HTMLButtonElement>,
  ) => {
    const join = watch(`view.childrenViews.${nestedIndex}.join`);

    e.preventDefault();

    if (fields.length < CONDITION_LIMIT) {
      append({
        op1: watch(`view.childrenViews.${nestedIndex}.items.${0}.op1`),
        operator: undefined,
        op2: '',
      });
    } else {
      //modal alert
      console.log('5개까지 가능');
    }
  };

  return (
    <>
      <div className="m-b-15">
        <p className="m-b-20">
          {t(`SWITCH_NODE_CONDITION_SELECT`)}
          <span className="required"> *</span>
        </p>

        <Row justify="space-between" className="m-b-20">
          <Col span={12} className="radioContainer">
            <Radio
              checked={
                watch(`view.childrenViews.${nestedIndex}.join`) === ConditionJoin.And
              }
              onChange={(e) => {
                joinField.onChange(+e.target.value);
              }}
              ref={joinField.ref}
              value={String(ConditionJoin.And)}
            >
              <span>And</span>
            </Radio>
          </Col>
          <Col span={12} className="radioContainer">
            <Radio
              checked={
                watch(`view.childrenViews.${nestedIndex}.join`) === ConditionJoin.Or
              }
              onChange={(e) => {
                joinField.onChange(+e.target.value);
              }}
              ref={joinField.ref}
              value={String(ConditionJoin.Or)}
            >
              <span>Or</span>
            </Radio>
          </Col>
        </Row>
      </div>
      {fields.map((item, i) => (
        <div key={item.id}>
          <Space direction="vertical" className="m-b-12" gap={12}>
            {i === 0 && (
              <>
                {' '}
                <div>
                  <span>{t(`CONDITION_NODE_SET_CONDITION`)} </span>
                  <span className="required">*</span>
                </div>
                <Row justify="space-between">
                  <Col span={3}>
                    <p className="firstConditionIf">if</p>
                  </Col>
                  <Col span={21}>
                    <FormItem
                      error={errors.view?.childrenViews?.[nestedIndex]?.items?.[i]?.op1}
                    >
                      <VariableSelector
                        placeholder={t(`INPUT_VARIABLE_FIRST_CONDITION_PLACEHOLDER`)}
                        control={control}
                        path={`view.childrenViews.${nestedIndex}.items.${i}.op1`}
                        maxLength={100}
                        readOnly={isReadOnly}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </>
            )}
            <FormItem
              error={errors.view?.childrenViews?.[nestedIndex]?.items?.[i]?.operator}
            >
              <OperatorSelector index={i} nestedIndex={nestedIndex} />
            </FormItem>
            <FormItem error={errors.view?.childrenViews?.[nestedIndex]?.items?.[i]?.op2}>
              <VariableSelector
                placeholder={t(`INPUT_VARIABLE_THIRD_CONDITION_PLACEHOLDER`)}
                control={control}
                path={`view.childrenViews.${nestedIndex}.items.${i}.op2`}
                maxLength={100}
                readOnly={isReadOnly}
              />
            </FormItem>

            {i > 0 ? (
              <Button
                shape="ghost"
                className="deleteBtn"
                onClick={() => handleDeleteButton(i)}
                disabled={isReadOnly}
              >
                {t(`CONDITION_NODE_DELETE_CONDITION`)}
              </Button>
            ) : null}

            {i < CONDITION_LIMIT - 1 && i + 1 === fields.length && !isReadOnly && (
              <div
                className={classNames(`joinWrapper`, {
                  on: watch(`view.childrenViews.${nestedIndex}.join`) !== undefined,
                })}
              >
                <Button
                  shape="ghost"
                  className={classNames(`join button`, {
                    on: true,
                  })}
                  onClick={(e) => {
                    if (i < CONDITION_LIMIT - 1 && fields.length === i + 1) {
                      handleAddConditionButton(e);
                    }
                  }}
                >
                  {fields.length === i + 1 ? `+ ${t(`SWITCH_NODE_ADD_CASE`)}` : ''}{' '}
                </Button>
              </div>
            )}
            {fields.length !== i + 1 && <Divider style={{ margin: '32px 0' }} />}
          </Space>
        </div>
      ))}
    </>
  );
};
