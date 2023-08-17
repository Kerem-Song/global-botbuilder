import { Button, Col, Divider, Input, Row, Space, Title } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useI18n, usePage, useRootState } from '@hooks';
import { useParameterClient } from '@hooks/client/parameterClient';
import {
  IParameterList,
  IPararmeterFormatList,
  ISaveParameter,
  ISaveParameterData,
} from '@models';
import {
  getReactSelectStyle,
  PARAMETER_REGEX,
  PARAMETER_REGEX_FIRST_LETTER,
  PARAMETER_REGEX_NEXT_LETTER_AFTER_DOT,
} from '@modules';
import { lunaToast } from '@modules/lunaToast';
import { FC, useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import Select from 'react-select';
import * as yup from 'yup';

export interface VariablePopupProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
  parameterList?: IParameterList | undefined;
}

export const ParameterPopup: FC<VariablePopupProps> = ({
  isOpen,
  handleIsOpen,
  parameterList,
}) => {
  const { i18n } = useI18n();
  const language = i18n.language;
  const { t, tc } = usePage();
  const token = useRootState((state) => state.botInfoReducer.token);
  const { parameterAsync, getParameterFormatsQuery } = useParameterClient();
  const { data: parameterFormats } = getParameterFormatsQuery();
  const [parameterFormat, setParameterFormat] = useState<number>();
  const [totalParameterFormatList, setTotalParameterFormatList] =
    useState<IPararmeterFormatList[]>();
  const [parameterInputError, setParameterInputError] = useState<string>('');
  const reactSelectStyle = getReactSelectStyle<IPararmeterFormatList>({});

  const variableNameSchema = yup.object({
    name: yup
      .string()
      .trim()
      .required(t('VALIDATION_REQUIRED'))
      .matches(PARAMETER_REGEX_FIRST_LETTER, t('PARAMETER_VALIDATION_FIRST_LETTER'))
      .when({
        is: (name: string) => name && !name.startsWith('.'),
        then: yup.string().matches(PARAMETER_REGEX, t('PARAMETER_VALIDATION')),
        otherwise: yup
          .string()
          .matches(
            PARAMETER_REGEX_NEXT_LETTER_AFTER_DOT,
            t('PARAMETER_VALIDATION_NEXT_LETTER_AFTER_DOT'),
          ),
      })
      .when({
        is: (name: string) => name && name.startsWith('.'),
        then: yup.string().matches(PARAMETER_REGEX, t('PARAMETER_VALIDATION')),
      }),
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

  const handleSave = async (variable: ISaveParameterData) => {
    const saveParameter: ISaveParameter = {
      sessionToken: token!,
      data: {
        id: parameterList?.id,
        name: variable.name,
        defaultValue: variable.defaultValue,
        formatType: parameterFormat!,
      },
    };

    const res = await parameterAsync({ ...saveParameter, customErrorCode: [7636] });

    if (res === 7636) {
      setParameterInputError(t('DUPLICATE_VARIABLE_MESSAGE'));
    } else {
      lunaToast.success(tc('SAVE_MESSAGE'));
      reset();
      handleClose();
    }
  };

  const handleClose = () => {
    handleIsOpen(false);
    setParameterInputError('');
  };

  useEffect(() => {
    if (parameterList?.id) {
      const parameterValue = {
        id: parameterList.id,
        name: parameterList.name,
        defaultValue: parameterList.defaultValue,
        formatType: parameterList.formatType!,
      };
      reset(parameterValue);
      setParameterFormat(parameterList.formatType!);
    } else if (isOpen) {
      reset({ name: '' });
      setParameterFormat(undefined);
    }
  }, [parameterList?.id, isOpen]);

  useEffect(() => {
    const formatList = parameterFormats?.result.map((x) => {
      return { value: x.formatType, label: x.example };
    });
    const totalFormatList: IPararmeterFormatList[] = [
      { value: 0, label: t('VARIABLE_FORMAT_PLACEHOLDER') },
      ...(formatList ? formatList : []),
    ];
    setTotalParameterFormatList(totalFormatList);
  }, [parameterFormats, language]);

  return (
    <ReactModal
      overlayClassName="parameterPopupOverlay"
      className="parameterPopup"
      isOpen={isOpen}
      onRequestClose={handleClose}
    >
      <div className="header">
        <Title level={4}>
          {parameterList?.id ? t('MODIFY_VARIABLE') : t('ADD_VARIABLE')}
        </Title>
      </div>
      <Divider />
      <form onSubmit={handleSubmit(handleSave)}>
        <Row align="center" className="parameterInfo">
          <Col span={6}>
            {t('VARIABLE_NAME')}
            <span style={{ color: 'red' }}>*</span>
          </Col>
          <Col span={18}>
            <Input
              showCount={parameterList && parameterList.name.length > 0 ? false : true}
              maxLength={50}
              placeholder={t('INPUT_VARIABLE_NAME_IN_ENGLISH')}
              ref={field.ref}
              value={field.value || ''}
              onChange={handleParameterName}
              onBlur={field.onBlur}
              isError={parameterInputError || errors.name?.message ? true : false}
              disabled={parameterList && parameterList.name.length > 0}
            />
            <span className="error-message">{parameterInputError}</span>
            <span className="error-message parameter-error">{errors.name?.message}</span>
          </Col>
        </Row>
        <Row align="center" className="parameterInfo">
          <Col span={6}>{t('VARIABLE_FORMAT')}</Col>
          <Col span={18}>
            <Select
              options={totalParameterFormatList}
              styles={reactSelectStyle}
              placeholder={t('VARIABLE_FORMAT_PLACEHOLDER')}
              value={
                totalParameterFormatList?.find((x) => x.value === parameterFormat) || null
              }
              onChange={(newOption) => {
                setParameterFormat(newOption?.value);
              }}
            />
          </Col>
        </Row>
        <Row align="center" className="parameterInfo">
          <Col span={6}>{t('DEFAULT_VALUE')}</Col>
          <Col span={18}>
            <Input {...register('defaultValue')} placeholder={t('INPUT_VARIABLE')} />
          </Col>
        </Row>
        <Row justify="flex-end" className="parameterPopupBtns">
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
