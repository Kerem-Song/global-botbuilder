import { Card, Col, FormItem, Input, Row, Space } from '@components';
import { useI18n, usePage } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { IReactSelect, IUtteranceModel } from '@models';
import { getReactSelectStyle } from '@modules';
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { useController, UseFormReturn } from 'react-hook-form';
import Select from 'react-select';

export interface IUtteranceGroupInfoProps {
  formMethods: UseFormReturn<IUtteranceModel>;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  isOpenUtteranceDetailPopup?: boolean;
}

export const UtteranceGroupInfo: FC<IUtteranceGroupInfoProps> = ({
  formMethods,
  setIsActive,
  isOpenUtteranceDetailPopup,
}) => {
  const { i18n } = useI18n();
  // const { t } = usePage();
  const { t } = useI18n('utternaceDetailPage');

  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();

  const language = i18n.language;
  const intentNameRef = useRef<HTMLInputElement | null>(null);
  const [totalScenarioList, setTotalScenarioList] = useState<IReactSelect[]>();
  const {
    control,
    formState: { errors },
  } = formMethods;

  const reactSelectStyle = getReactSelectStyle({});
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
                value={nameField.value}
                ref={(e) => {
                  nameField.ref(e);
                  intentNameRef.current = e;
                }}
                onChange={(e) => {
                  nameField.onChange(e);
                  setIsActive(true);
                }}
                placeholder={t('INPUT_INTENT_NAME')}
                maxLength={20}
                showCount
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
                onChange={(options: any) => {
                  scenarioListField.onChange(options.value);
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
