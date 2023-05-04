import { Button, Card, Col, Input, Row, Space } from '@components';
import { usePage } from '@hooks';
import { ISaveEntryGroup } from '@models';
import React, { FC, useState } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { EmptyEntry } from './EmptyEntry';
import { EntryItem } from './EntryItem';

export interface IEntryRegistryProps {
  searchKeyword: string;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  formMethods: UseFormReturn<ISaveEntryGroup>;
}

export const EntriesRegistry: FC<IEntryRegistryProps> = ({
  searchKeyword,
  setIsActive,
  formMethods,
}) => {
  const { t } = usePage();
  const [representativeEntryInputError, setRepresentativeEntryInputError] =
    useState<string>('');
  const [synonym, setSynonym] = useState<string>('');
  const {
    control,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = formMethods;
  const { fields, prepend, remove } = useFieldArray({ control, name: 'entries' });

  const handleRegisterEntry = () => {
    const name = synonym.trim();

    if (name === '') {
      trigger('entries');
    }

    if (fields.length > 0 && synonym.length > 0 && name === '') {
      setRepresentativeEntryInputError(t('VALIDATION_REQUIRED'));
      setIsActive(true);
      return;
    } else if (name !== '') {
      prepend({ representativeEntry: name, synonym: [] });
      setIsActive(true);
      setSynonym('');
    }
  };

  return (
    <Card className="entityDetail" radius="normal">
      <Space direction="vertical" gap={10}>
        <Row gap={8}>
          <Col flex="auto">
            <Input
              placeholder={t('INPUT_REPRESENTATIVE_ENTRY')}
              size="normal"
              maxLength={125}
              showCount
              value={synonym}
              onPressEnter={handleRegisterEntry}
              onChange={(e) => {
                setIsActive(true);
                setSynonym(e.target.value);
                setRepresentativeEntryInputError('');
              }}
              isError={
                representativeEntryInputError || errors.entries?.message ? true : false
              }
            />
            <span className="error-message">{representativeEntryInputError}</span>
            <span className="error-message">{errors.entries?.message}</span>
          </Col>
          <Col>
            <Button type="primary" onClick={handleRegisterEntry}>
              {t('REGISTER_ENTRY')}
            </Button>
          </Col>
        </Row>
        <Space gap={8} direction="vertical">
          {watch('entries').length === 0 ? (
            <EmptyEntry />
          ) : (
            watch('isRegex') === false && (
              <>
                {fields.map((entryGroup, i) => {
                  return (
                    <EntryItem
                      key={entryGroup.id}
                      index={i}
                      entryGroup={entryGroup}
                      entriesRemove={remove}
                      searchKeyword={searchKeyword}
                      setIsActive={setIsActive}
                      trigger={trigger}
                    />
                  );
                })}
                {searchKeyword.trim() !== '' &&
                  getValues().entries.filter(
                    (x) =>
                      (x.representativeEntry &&
                        x.representativeEntry?.includes(searchKeyword)) ||
                      (x.synonym && x.synonym?.find((s) => s.includes(searchKeyword))),
                  ).length === 0 && <EmptyEntry />}
              </>
            )
          )}
        </Space>
      </Space>
    </Card>
  );
};
