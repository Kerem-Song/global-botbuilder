import { Card, Col, Input, Radio, Row, Space } from '@components';
import { useEntityClient, usePage } from '@hooks';
import { ISaveEntryGroup } from '@models';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { useController, UseFormReturn } from 'react-hook-form';

export interface IEntityRegistryProps {
  entryId?: string;
  formMethods: UseFormReturn<ISaveEntryGroup>;
  regexInputError: string;
  entryNameInputError: string;
  setEntryNameInputError: React.Dispatch<React.SetStateAction<string>>;
  setRegexInputError: Dispatch<SetStateAction<string>>;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EntityRegistry: FC<IEntityRegistryProps> = ({
  entryId,
  formMethods,
  regexInputError,
  entryNameInputError,
  setEntryNameInputError,
  setRegexInputError,
  setIsActive,
}) => {
  const { t } = usePage();
  const { getEntryDetailQuery } = useEntityClient();
  const entryDetails = getEntryDetailQuery(entryId);
  const {
    control,
    watch,
    formState: { errors },
  } = formMethods;
  const { field } = useController({ name: 'entries', control });
  const { field: isRegexField } = useController({ name: 'isRegex', control });
  const { field: nameField } = useController({ name: 'name', control });

  const handleEntityName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.indexOf(' ') > -1) {
      e.target.value = e.target.value.replaceAll(' ', '');
    }
    nameField.onChange(e);
    setIsActive(true);
    setEntryNameInputError('');
  };

  const handleRegexExpression = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === '') {
      field.onChange([]);
    } else {
      field.onChange([{ representativeEntry: e.target.value }]);
      setIsActive(true);
      setRegexInputError('');
    }
  };

  return (
    <Card
      radius="normal"
      bodyStyle={{ padding: '20px' }}
      style={{ border: '1px solid #DCDCDC', marginTop: '20px' }}
    >
      <Space direction="vertical">
        <Row align="center" gap={10} style={{ marginBottom: '20px' }}>
          <Col style={{ width: '140px' }}>
            <span>{t('ENTITY_NAME')}</span>
            <span style={{ color: 'red' }}> *</span>
          </Col>
          <Col flex="auto">
            <Input
              placeholder={t('INPUT_ENTITY_NAME')}
              maxLength={20}
              showCount
              ref={nameField.ref}
              value={nameField.value}
              onChange={handleEntityName}
              isError={entryNameInputError || errors.name?.message ? true : false}
            />
            <span className="error-message">{entryNameInputError}</span>
            <span className="error-message">{errors.name?.message}</span>
          </Col>
        </Row>
        <Row align="center" gap={10} style={{ marginBottom: '20px' }}>
          <Col style={{ width: '140px' }}>
            <span>{t('ENTRY_TYPE')}</span>
            <span style={{ color: 'red' }}> *</span>
          </Col>
          {entryDetails?.data?.id ? (
            <Col style={{ display: 'flex' }}>
              {entryDetails?.data?.entryGroupType === 0 ? 'String' : 'Regex'}
            </Col>
          ) : (
            <>
              <Radio
                checked={!isRegexField.value}
                onChange={() => isRegexField.onChange(false)}
                ref={isRegexField.ref}
              >
                String
              </Radio>
              <Radio
                style={{ marginLeft: '40px' }}
                checked={isRegexField.value}
                onChange={() => isRegexField.onChange(true)}
                ref={isRegexField.ref}
              >
                Regex
              </Radio>
            </>
          )}
        </Row>
        {watch('isRegex') && (
          <Row align="center" gap={10}>
            <Col style={{ width: '140px' }}>
              <span>{t('REGULAR_EXPRESSION')}</span>
              <span style={{ color: 'red' }}> *</span>
            </Col>
            <Col flex="auto">
              <Input
                placeholder={t('INPUT_REGULAR_EXPRESSION')}
                isError={regexInputError || errors.entries?.message ? true : false}
                ref={field.ref}
                value={field.value[0]?.representativeEntry || ''}
                onChange={handleRegexExpression}
              />
              <span className="error-message">{regexInputError}</span>
              <span className="error-message">{errors.entries?.message || ''}</span>
            </Col>
          </Row>
        )}
      </Space>
    </Card>
  );
};
