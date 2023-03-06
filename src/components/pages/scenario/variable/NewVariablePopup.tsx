import { Button, Col, Divider, FormItem, Input, Row, Space, Title } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePage, useRootState } from '@hooks';
import { useVariableClient } from '@hooks/client/variableClient';
import { IHasResults, ISaveParameter, ISaveParameterData, IVariableList } from '@models';
import { lunaToast } from '@modules/lunaToast';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import Select from 'react-select';
import * as yup from 'yup';

import { reactSelectStyle } from '../edit/ButtonCtrlSelector';

export interface NewVariablePopupProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
}

export const NewVariablePopup: FC<NewVariablePopupProps> = ({ isOpen, handleIsOpen }) => {
  const { variableMutate } = useVariableClient();

  const { t, tc } = usePage();

  const token = useRootState((state) => state.botInfoReducer.token);

  const variableNameSchema = yup.object({
    name: yup
      .string()
      .trim()
      .matches(/^[a-z0-9_]*$/, `영어 소문자, 숫자, 특수문자 _ 만 입력 가능합니다.`)
      .required(`필수 입력 항목입니다.`),
  });

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISaveParameterData>({
    defaultValues: {},
    resolver: yupResolver(variableNameSchema),
  });

  const handleClose = () => {
    handleIsOpen(false);
    reset();
  };

  const handleSave = (variable: ISaveParameterData): void => {
    if (variable.id) {
      const modifyParameter: ISaveParameter = {
        sessionToken: token!,
        data: {
          name: variable.name,
          defaultValue: variable.defaultValue,
          formatType: 2,
        },
      };

      variableMutate.mutate(modifyParameter, {
        onSuccess: (submitResult) => {
          console.log('modifyParameter', submitResult);
          if (submitResult && submitResult.isSuccess) {
            lunaToast.success();
            reset();
            handleClose();
          }
        },
      });
    } else {
      const newVariable: ISaveParameter = {
        sessionToken: token!,
        data: {
          name: variable.name,
          defaultValue: variable.defaultValue,
          // formatType: variable.formatType,
          formatType: 2,
        },
      };

      variableMutate.mutate(newVariable, {
        onSuccess: (submitResult) => {
          console.log('newVariable', submitResult);
          if (submitResult && submitResult.isSuccess) {
            lunaToast.success();
            reset();
            handleClose();
          }
        },
      });
    }
  };

  return (
    <ReactModal
      style={{
        content: {
          width: '600px',
          height: 'fit-content',
          margin: 'auto',
          marginTop: '200px',
          padding: 0,
        },
      }}
      isOpen={isOpen}
    >
      <div style={{ padding: '14px 20px 2px 20px' }}>
        <Title level={4}>{t('ADD_VARIABLE')}</Title>
      </div>
      <Divider />
      <form onSubmit={handleSubmit(handleSave)}>
        <Row align="center" style={{ padding: '9px 20px 20px 20px' }}>
          <Col span={6}>
            {t('VARIABLE_NAME')}
            <span style={{ color: 'red' }}>*</span>
          </Col>
          <Col span={18}>
            <FormItem error={errors.name}>
              <Input
                style={{ textTransform: 'lowercase' }}
                {...register('name')}
                placeholder={t('INPUT_VARIABLE_NAME_IN_ENGLISH')}
              />
            </FormItem>
          </Col>
        </Row>
        <Row align="center" style={{ padding: '9px 20px 20px 20px' }}>
          <Col span={6}>{t('VARIABLE_FORMAT')}</Col>
          <Col span={18}>
            <FormItem>
              <Select
                styles={reactSelectStyle}
                placeholder={t('VARIABLE_FORMAT_PLACEHOLDER')}
              ></Select>
            </FormItem>
          </Col>
        </Row>
        <Row align="center" style={{ padding: '9px 20px 20px 20px' }}>
          <Col span={6}>{t('DEFAULT_VALUE')}</Col>
          <Col span={18}>
            <FormItem>
              <Input {...register('defaultValue')} placeholder={t('INPUT_VARIABLE')} />
            </FormItem>
          </Col>
        </Row>
        <Row justify="flex-end" style={{ padding: '0 20px 20px 20px' }}>
          <Space>
            <Button className="min-w-100" onClick={handleClose}>
              {tc('CANCEL')}
            </Button>
            <Button className="min-w-100" htmlType="submit" type="primary">
              {tc('OK')}
            </Button>
          </Space>
        </Row>
      </form>
    </ReactModal>
  );
};
