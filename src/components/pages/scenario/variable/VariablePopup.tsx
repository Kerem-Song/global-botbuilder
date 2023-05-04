import { Button, Col, Divider, Input, Row, Space, Title } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useI18n, usePage, useRootState } from '@hooks';
import { useVariableClient } from '@hooks/client/variableClient';
import {
  IPararmeterList,
  ISaveParameter,
  ISaveParameterData,
  IVariableList,
} from '@models';
import { PARAMETER_REGEX } from '@modules';
import { lunaToast } from '@modules/lunaToast';
import { FC, useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import Select from 'react-select';
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
  const { i18n } = useI18n();
  const { t, tc } = usePage();
  const language = i18n.language;
  const [formats, setFormats] = useState<number>();
  const [parameterInputError, setParameterInputError] = useState<string>('');
  const { variableMutateAsync, getParameterFormatsQuery } = useVariableClient();
  const { data: parameterFormats } = getParameterFormatsQuery();
  const [totalFormatList, setTotalScenarioList] = useState<IPararmeterList[]>();

  const token = useRootState((state) => state.botInfoReducer.token);

  const variableNameSchema = yup.object({
    name: yup
      .string()
      .lowercase()
      .trim()
      .required(t('VALIDATION_REQUIRED'))
      .matches(
        PARAMETER_REGEX,
        `영어 소문자, 숫자, 특수문자 _,-,. 만 입력 가능합니다.\n(.은 변수명 앞머리에만 가능합니다.)`,
      ),
  });

  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ISaveParameterData>({
    defaultValues: {},
    resolver: yupResolver(variableNameSchema),
  });

  const { field } = useController({ name: 'name', control });

  const handleParameterName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.indexOf(' ') !== -1) {
      e.target.value = e.target.value.replaceAll(' ', '');
    }
    field.onChange(e);
    setParameterInputError('');
  };

  const handleSave = (variable: ISaveParameterData): void => {
    const saveParameter: ISaveParameter = {
      sessionToken: token!,
      data: {
        id: variableList?.id,
        name: variable.name,
        defaultValue: variable.defaultValue,
        formatType: formats!,
      },
    };

    variableMutateAsync(saveParameter, {
      onSuccess: (res) => {
        console.log('modifyParameter', res);
        if (res && res.isSuccess) {
          lunaToast.success(t('MODIFY_MESSAGE'));
          reset();
          handleClose();
        } else if (res?.exception?.errorCode === 7636) {
          setParameterInputError(t('DUPLICATE_VARIABLE_MESSAGE'));
        }
      },
    });
  };

  const handleClose = () => {
    handleIsOpen(false);
    setParameterInputError('');
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
      reset({ name: '' });
      setFormats(undefined);
    }
  }, [variableList?.id, isOpen]);

  useEffect(() => {
    const formatList = parameterFormats?.result.map((x) => {
      return { value: x.formatType, label: x.example };
    });
    const totalFormatList = [
      { value: 0, label: t('VARIABLE_FORMAT_PLACEHOLDER') },
      ...(formatList ? formatList : []),
    ];
    setTotalScenarioList(totalFormatList);
  }, [parameterFormats, language]);

  return (
    <ReactModal className="variableModal" isOpen={isOpen}>
      <div className="header">
        <Title level={4}>
          {variableList?.id ? t('MODIFY_VARIABLE') : t('ADD_VARIABLE')}
        </Title>
      </div>
      <Divider />
      <form onSubmit={handleSubmit(handleSave)}>
        <Row align="center" className="variableInfo">
          <Col span={6}>
            {t('VARIABLE_NAME')}
            <span style={{ color: 'red' }}>*</span>
          </Col>
          <Col span={18}>
            <Input
              placeholder={t('INPUT_VARIABLE_NAME_IN_ENGLISH')}
              style={{ textTransform: 'lowercase' }}
              ref={field.ref}
              value={field.value || ''}
              onChange={handleParameterName}
              onBlur={field.onBlur}
              isError={parameterInputError || errors.name?.message ? true : false}
            />
            <span className="error-message">{parameterInputError}</span>
            <span className="error-message parameter-error">{errors.name?.message}</span>
          </Col>
        </Row>
        <Row align="center" className="variableInfo">
          <Col span={6}>{t('VARIABLE_FORMAT')}</Col>
          <Col span={18}>
            <Select
              options={totalFormatList}
              styles={reactSelectStyle}
              menuPortalTarget={document.body}
              placeholder={t('VARIABLE_FORMAT_PLACEHOLDER')}
              value={totalFormatList?.find((x) => x.value === formats) || null}
              onChange={(e: any) => {
                setFormats(e.value);
              }}
            />
          </Col>
        </Row>
        <Row align="center" className="variableInfo">
          <Col span={6}>{t('DEFAULT_VALUE')}</Col>
          <Col span={18}>
            <Input {...register('defaultValue')} placeholder={t('INPUT_VARIABLE')} />
          </Col>
        </Row>
        <Row justify="flex-end" className="variableModalBtns">
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
