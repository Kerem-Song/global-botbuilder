import { Button, Col, Divider, FormItem, Radio, Row, Space } from '@components';
import { useHistoryViewerMatch, usePage } from '@hooks';
import { ConditionJoin, ConditionOperator, IGNodeEditModel } from '@models';
import { ISwitchView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { OperatorSelector } from './OperatorSelector';
import { VariableSelector } from './VariableSelector';

export const SwitchConditions = ({ nestedIndex }: { nestedIndex: number }) => {
  const CONDITION_LIMIT = 5;
  const { t } = usePage();

  const {
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<ISwitchView>>();

  const { fields, append, remove } = useFieldArray({
    name: `view.conditions.${nestedIndex}.items`,
    control,
  });

  const { field: joinField } = useController({
    name: `view.conditions.${nestedIndex}.join`,
    control,
  });

  const handleDeleteButton = (index: number) => {
    remove(index);
  };

  const handleAddConditionButton = (
    e: React.MouseEvent<HTMLLabelElement | HTMLButtonElement>,
  ) => {
    console.log('handle add condition btn');
    const join = watch(`view.conditions.${nestedIndex}.join`);

    e.preventDefault();
    if (fields.length < CONDITION_LIMIT) {
      append({
        op1: '',
        operator: ConditionOperator.Is,
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
              checked={watch(`view.conditions.${nestedIndex}.join`) === ConditionJoin.And}
              onChange={(e) => {
                joinField.onChange(+e.target.value);
              }}
              ref={joinField.ref}
              value={ConditionJoin.And}
            >
              <span>And</span>
            </Radio>
          </Col>
          <Col span={12} className="radioContainer">
            <Radio
              checked={watch(`view.conditions.${nestedIndex}.join`) === ConditionJoin.Or}
              onChange={(e) => {
                joinField.onChange(+e.target.value);
              }}
              ref={joinField.ref}
              value={ConditionJoin.Or}
            >
              <span>Or</span>
            </Radio>
          </Col>
        </Row>
      </div>
      {fields.map((item, i) => (
        <div key={item.id}>
          <Space direction="vertical" className="m-b-8">
            <div>
              <span>{t(`CONDITION_NODE_SET_CONDITION`)} </span>
              <span className="required">*</span>
            </div>
            <Row justify="space-between" align="center">
              <Col span={2} style={{ textAlign: 'center' }}>
                if
              </Col>
              <Col span={22}>
                {' '}
                <FormItem error={errors.view?.conditions?.[nestedIndex]?.items?.[i]?.op1}>
                  <VariableSelector
                    placeholder={t(`INPUT_VARIABLE_FIRST_CONDITION_PLACEHOLDER`)}
                    control={control}
                    path={`view.conditions.${nestedIndex}.items.${i}.op1`}
                    maxLength={100}
                  />
                </FormItem>
              </Col>
            </Row>

            <FormItem
              error={errors.view?.conditions?.[nestedIndex]?.items?.[i]?.operator}
            >
              <OperatorSelector index={i} nestedIndex={nestedIndex} />
            </FormItem>
            <FormItem error={errors.view?.conditions?.[nestedIndex]?.items?.[i]?.op2}>
              <VariableSelector
                placeholder={t(`INPUT_VARIABLE_THIRD_CONDITION_PLACEHOLDER`)}
                control={control}
                path={`view.conditions.${nestedIndex}.items.${i}.op2`}
                maxLength={100}
              />
            </FormItem>

            {i < CONDITION_LIMIT - 1 && i + 1 === fields.length && (
              <div
                className={classNames(`joinWrapper`, {
                  on: watch(`view.conditions.${nestedIndex}.join`) !== undefined,
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
                  {fields.length === i + 1 ? '+ Add' : ''}{' '}
                </Button>
              </div>
            )}
            {i > 0 ? (
              <div className="deleteBtn">
                <Button shape="ghost" onClick={() => handleDeleteButton(i)}>
                  {t(`CONDITION_NODE_DELETE_CONDITION`)}
                </Button>
              </div>
            ) : (
              <div className="deleteBtn"></div>
            )}
            {fields.length !== i + 1 && <Divider />}
          </Space>
        </div>
      ))}
    </>
  );
};
