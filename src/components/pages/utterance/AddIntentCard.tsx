import { FormItem, Input } from '@components';
import { Card } from '@components/data-display';
import { Col, Row, Space } from '@components/layout';
import { yupResolver } from '@hookform/resolvers/yup';
import { useI18n, usePage } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { IReactSelect, IUtteranceModel } from '@models';
import { BOTNAME_REGEX } from '@modules';
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { Control, useController, useForm } from 'react-hook-form';
import Select from 'react-select';
import * as yup from 'yup';

import { reactSelectStyle } from '../scenario/edit/ButtonCtrlSelector';

export interface IAddIntentCard {
  control: Control<IUtteranceModel>;
  setIsActive: Dispatch<SetStateAction<boolean>>;
}

export const AddIntentCard: FC<IAddIntentCard> = ({ control, setIsActive }) => {
  const { i18n } = useI18n();
  const { t, tc } = usePage();
  const language = i18n.language;
  const intentNameRef = useRef<HTMLInputElement | null>(null);
  const [totalScenarioList, setTotalScenarioList] = useState<IReactSelect[]>();
  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();
  const schema = yup.object({
    name: yup
      .string()
      .trim()
      .required(t('VALIDATION_REQUIRED'))
      .matches(BOTNAME_REGEX, {
        message: tc('BOTNAME_REGEX_MESSAGE'),
      }),
  });
  const {
    formState: { errors },
  } = useForm<IUtteranceModel>({
    defaultValues: {
      name: '',
      connectScenarioId: '',
      items: [],
    },
    resolver: yupResolver(schema),
  });

  const { field: nameField } = useController({
    name: `name`,
    control,
  });

  const { field: scenarioListField } = useController({
    name: `connectScenarioId`,
    control,
  });

  useEffect(() => {
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
  }, [data, language]);

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
      </Space>
    </Card>
  );
};
