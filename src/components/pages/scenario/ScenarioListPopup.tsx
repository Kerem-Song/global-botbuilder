import { Button, Col, Divider, FormItem, Input, Row, Space, Title } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePage, useRootState, useScenarioClient } from '@hooks';
import { IException, IScenarioModel } from '@models';
import { BOTNAME_REGEX } from '@modules';
import { lunaToast } from '@modules/lunaToast';
import { setScenarioPopupOpen } from '@store/scenarioListPopupSlice';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import * as yup from 'yup';

interface IScenarioListInput {
  token: string;
  scenarioName: string;
}

export const ScenarioListPopup: FC<{
  isOpen: boolean;
  scenarios?: IScenarioModel[];
}> = ({ isOpen, scenarios }) => {
  const { t, tc } = usePage();
  const dispatch = useDispatch();
  const { scenarioCreateAsync, scenarioRenameAsync, scenarioDuplicateMutateAsync } =
    useScenarioClient();
  const { pathname } = useLocation();
  const token = useRootState((state) => state.botInfoReducer.token);
  const popupType = useRootState((state) => state.scenarioListPopupReducer.popupType);
  const item = useRootState((state) => state.scenarioListPopupReducer.item);
  const schema = yup.object({
    scenarioName: yup
      .string()
      .trim()
      .required(t(`VALIDATION_REQUIRED`))
      .matches(BOTNAME_REGEX, t(`VALIDATION_SCENARIO_LIST_NAME`)),
  });

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<IScenarioListInput>({
    resolver: yupResolver(schema),
  });

  const handleScenarioPopupClose = () => {
    dispatch(setScenarioPopupOpen(false));
    clearErrors('scenarioName');
  };

  const onSubmit = async () => {
    await handleScenario();
  };

  const handleScenario = async () => {
    if (token) {
      const filtered = scenarios?.find(
        (scenario) => scenario.alias === watch('scenarioName'),
      );

      if (filtered) {
        setError('scenarioName', {
          type: 'custom',
          message: t(`DUPLICATED_SCENARIO_NAME_MESSAGE`),
        });
        return;
      }

      let res;
      if (popupType === 'create') {
        res = await scenarioCreateAsync({
          token,
          scenarioName: watch('scenarioName'),
        });
      } else if (popupType === 'duplicate') {
        if (item) {
          res = await scenarioDuplicateMutateAsync({
            scenario: { ...item, alias: watch('scenarioName') },
          });
        }
      } else {
        if (item) {
          res = await scenarioRenameAsync({
            scenario: { ...item, alias: watch('scenarioName') },
          });
        }
      }

      if (res?.data && res.data.isSuccess && !filtered) {
        dispatch(setScenarioPopupOpen(false));
        lunaToast.success(
          popupType === 'create'
            ? t(`MAKING_NEW_SCENARIO_IS_SUCCESS`)
            : popupType === 'rename'
            ? t('CHANGING_SCENARIO_NAME_SUCCESS')
            : t('DUPLICATEING_SCENARIO_IS_SUCCESS'),
        );
      } else {
        if (filtered) {
          setError('scenarioName', {
            type: 'custom',
            message: t(`DUPLICATED_SCENARIO_NAME_MESSAGE`),
          });
        } else {
          const exeption = res?.data.exception as IException;

          lunaToast.error(exeption.message || '');
        }
      }
    }
  };

  useEffect(() => {
    if ((popupType === 'rename' || popupType === 'duplicate') && item) {
      setValue('scenarioName', item.alias);
    } else if (popupType === 'create') {
      setValue('scenarioName', '');
    }
  }, [isOpen, popupType]);

  return (
    <ReactModal
      isOpen={isOpen}
      className="scenarioListPopupWrapper node-draggable-ignore"
      overlayClassName="scenarioListPopupOverlay"
      onRequestClose={handleScenarioPopupClose}
      onAfterOpen={() => setFocus('scenarioName')}
      shouldCloseOnOverlayClick={false}
    >
      {' '}
      <div style={{ padding: '14px 20px 2px 20px' }}>
        <Title level={4}>
          {popupType === 'create'
            ? t('MAKING_NEW_SCENARIO_LABEL')
            : popupType === 'rename'
            ? t('CHANGE_SCENARIO_NAME')
            : t('DUPLICATE_SCENARIO')}
        </Title>
      </div>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row align="center" style={{ padding: '9px 20px 20px 20px' }}>
          <Col span={6}>
            {popupType === 'create' ? t('ADD_A_NEW_SCENARIO_BTN') : t('SCENARIO_NAME')}
            <span className="required">*</span>
          </Col>
          <Col span={18}>
            <FormItem error={errors.scenarioName}>
              <Input
                placeholder={t('INPUT_SCENARIO_NAME')}
                {...register('scenarioName')}
                maxLength={20}
                showCount
              />
            </FormItem>
          </Col>
        </Row>

        <Row justify="flex-end" style={{ padding: '0 20px 20px 20px' }}>
          <Space>
            <Button className="min-w-100" onClick={handleScenarioPopupClose}>
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
