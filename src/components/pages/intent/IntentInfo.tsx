import { Card, Col, FormItem, Input, Row, Space } from '@components';
import { useI18n } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { IReactSelect, IUtteranceModel } from '@models';
import { getReactSelectStyle } from '@modules';
import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useController, UseFormReturn } from 'react-hook-form';
import Select from 'react-select';

export interface IIntentGroupInfoProps {
  intentNameRef: MutableRefObject<HTMLInputElement | null>;
  formMethods: UseFormReturn<IUtteranceModel>;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  isOpenUtteranceDetailPopup?: boolean;
}

export const IntentInfo: FC<IIntentGroupInfoProps> = ({
  intentNameRef,
  formMethods,
  setIsActive,
  isOpenUtteranceDetailPopup,
}) => {
  const { i18n } = useI18n();
  const { t } = useI18n('IntentDetailPage');
  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();

  const language = i18n.language;
  const [totalScenarioList, setTotalScenarioList] = useState<IReactSelect[]>();
  const {
    control,
    formState: { errors },
  } = formMethods;

  const reactSelectStyle = getReactSelectStyle<IReactSelect>({});
  const { field: scenarioListField } = useController({
    name: `connectScenarioId`,
    control,
  });

  const { field: nameField } = useController({
    name: `name`,
    control,
  });

  useEffect(() => {
    if (!isOpenUtteranceDetailPopup) {
      const scenarioList = data
        ?.filter((item) => !item.isFallbackFlow)
        .map((x) => {
          return { value: x.id, label: x.alias };
        });

      const total = [
        { value: '', label: t('SELECT_SCENARIO') },
        ...(scenarioList ? scenarioList : []),
      ];

      setTotalScenarioList(total);
    }
  }, [language, isOpenUtteranceDetailPopup]);

  useEffect(() => {
    if (nameField.value === '' && intentNameRef.current) {
      intentNameRef.current.focus();
    }
  }, [nameField.value]);

  const handleIntentName = (e: React.ChangeEvent<HTMLInputElement>) => {
    nameField.onChange(e.target.value);
    setIsActive(true);
  };

  return (
    <Card
      radius="normal"
      bodyStyle={{ padding: '20px' }}
      style={{ border: '1px solid #DCDCDC', marginTop: '20px' }}
    >
      <Space direction="vertical">
        <p style={{ fontSize: '16px', fontWeight: 500 }}>{t('TITLE')}</p>
        <Row align="center" gap={10}>
          <Col style={{ width: '130px' }}>
            <span>{t('INTENT_NAME')}</span>
            <span style={{ color: 'red' }}> *</span>
          </Col>
          <Col flex="auto">
            <FormItem error={errors.name}>
              <Input
                maxLength={50}
                showCount
                ref={intentNameRef}
                value={nameField.value}
                onChange={handleIntentName}
                placeholder={t('INPUT_INTENT_NAME')}
              />
            </FormItem>
          </Col>
        </Row>
        {!isOpenUtteranceDetailPopup && (
          <Row align="center" gap={10}>
            <Col style={{ width: '130px' }}>
              <span>{t('CONNECT_SCENARIOS')}</span>
            </Col>
            <Col flex="auto">
              <Select
                {...scenarioListField}
                options={totalScenarioList}
                value={totalScenarioList?.find(
                  (item) => item.value === scenarioListField.value,
                )}
                onChange={(newOption) => {
                  scenarioListField.onChange(newOption?.value);
                  setIsActive(true);
                }}
                styles={reactSelectStyle}
                isSearchable={false}
                placeholder={t('SELECT_SCENARIO')}
              />
            </Col>
          </Row>
        )}
      </Space>
    </Card>
  );
};
