import { Button, Col, Divider, FormItem, Input, Row, Space, Title } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePage, useRootState, useSystemModal } from '@hooks';
import { useVariableClient } from '@hooks/client/variableClient';
import {
  IPararmeterList,
  ISaveParameter,
  ISaveParameterData,
  IVariableList,
} from '@models';
import { lunaToast } from '@modules/lunaToast';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import Select from 'react-select';
import { format } from 'url';
import * as yup from 'yup';

import { reactSelectStyle } from '../edit/ButtonCtrlSelector';

export interface VariablePopupProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
  variableList?: IVariableList | undefined;
}

export const VariablePopup: FC<VariablePopupProps> = ({
  isOpen,
  handleIsOpen,
  variableList,
}) => {
  const [formats, setFormats] = useState<number>();
  const { variableMutate, getParameterFormatsQuery } = useVariableClient();
  const { data: parameterFormats } = getParameterFormatsQuery();
  const [totalFormatList, setTotalScenarioList] = useState<IPararmeterList[]>();

  // const formatsList = parameterFormats?.result.map((x) => {
  //   return { value: x.formatType, label: x.example };
  // });

  const { t, tc } = usePage();
  const { confirm, error: modalError } = useSystemModal();

  const token = useRootState((state) => state.botInfoReducer.token);

  const variableNameSchema = yup.object({
    name: yup
      .string()
      .lowercase()
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

  useEffect(() => {
    if (variableList?.id) {
      const resetValue = {
        id: variableList.id,
        name: variableList.name,
        defaultValue: variableList.defaultValue,
        formatType: variableList.formatType!,
      };
      reset(resetValue);
      setFormats(variableList.formatType!);
    } else if (isOpen) {
      reset({});
      setFormats(undefined);
    }
  }, [variableList?.id, isOpen]);

  useEffect(() => {
    const formatList = parameterFormats?.result.map((x) => {
      return { value: x.formatType, label: x.example };
    });
    const totalFormatList = [
      { value: 0, label: '변수 포맷을 선택해주세요.' },
      ...(formatList ? formatList : []),
    ];
    setTotalScenarioList(totalFormatList);
  }, [parameterFormats]);

  const handleSave = (variable: ISaveParameterData): void => {
    if (variableList?.id) {
      const modifyParameter: ISaveParameter = {
        sessionToken: token!,
        data: {
          id: variableList.id,
          name: variable.name,
          defaultValue: variable.defaultValue,
          formatType: formats!,
        },
      };

      variableMutate.mutate(modifyParameter, {
        onSuccess: (submitResult) => {
          console.log('modifyParameter', submitResult);
          if (submitResult && submitResult.isSuccess) {
            lunaToast.success();
            reset();
            // setFormats(undefined);
            handleClose();
          }
        },
        onError: (error) => {
          console.log('modifyError', error);
          if (error) {
            modalError({
              title: '중복 변수명',
              description: <span>중복된 변수명입니다.</span>,
            });
          }
        },
      });
    } else {
      const newVariable: ISaveParameter = {
        sessionToken: token!,
        data: {
          name: variable.name,
          defaultValue: variable.defaultValue,
          formatType: formats!,
        },
      };

      variableMutate.mutate(newVariable, {
        onSuccess: (submitResult) => {
          console.log('newVariable', submitResult);
          if (submitResult && submitResult.isSuccess) {
            lunaToast.success();
            reset();
            handleClose();
          } else {
            modalError({
              title: '중복 변수명',
              description: <span>중복된 변수명입니다.</span>,
            });
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
          height: '317px',
          margin: 'auto',
          marginTop: '200px',
          padding: 0,
          overflowY: 'hidden',
        },
      }}
      isOpen={isOpen}
    >
      <div style={{ padding: '14px 20px 2px 20px' }}>
        <Title level={4}>{variableList?.id ? '변수 수정' : '변수 추가'}</Title>
        {/* <Title level={4}>{t('ADD_VARIABLE')}</Title> */}
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
                options={totalFormatList}
                styles={reactSelectStyle}
                menuPortalTarget={document.body}
                placeholder={t('VARIABLE_FORMAT_PLACEHOLDER')}
                value={totalFormatList?.find((x) => x.value === formats) || null}
                onChange={(e: any) => {
                  setFormats(e.value);
                }}
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
