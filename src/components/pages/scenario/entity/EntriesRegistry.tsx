import { Button, Card, Col, Input, Row, Space } from '@components';
import { usePage } from '@hooks';
import { ISaveEntryGroup } from '@models';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { EmptyEntry } from './EmptyEntry';
import { EntryItem } from './EntryItem';

export interface IEntryRegistryProps {
  searchKeyword: string;
  formMethods: UseFormReturn<ISaveEntryGroup>;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEntriesActive: Dispatch<SetStateAction<boolean>>;
  setIsSaveBtnActive: Dispatch<
    SetStateAction<{
      isActive: boolean;
      isEntriesActive: boolean;
    }>
  >;
}

export const EntriesRegistry: FC<IEntryRegistryProps> = ({
  searchKeyword,
  formMethods,
  setIsActive,
  setIsEntriesActive,
  setIsSaveBtnActive,
}) => {
  const { t } = usePage();
  const [representativeEntry, setRepresentativeEntry] = useState<string>('');
  const {
    control,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = formMethods;
  const { fields, prepend, remove } = useFieldArray({ control, name: 'entries' });

  const handleRegisterEntry = async () => {
    const name = representativeEntry.trim();
    if (name === '') {
      await trigger('entries');
    } else if (name !== '') {
      prepend({ representativeEntry: name, synonym: [] });
      setIsActive(true);
      setIsSaveBtnActive((prev) => ({ ...prev, isActive: true }));
      setRepresentativeEntry('');
    }
  };

  const handleRepresentativeEntry = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepresentativeEntry(e.target.value);
    setIsActive(true);
    setIsSaveBtnActive((prev) => ({ ...prev, isActive: true }));
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
              value={representativeEntry}
              onPressEnter={handleRegisterEntry}
              onChange={handleRepresentativeEntry}
              isError={errors.entries?.message ? true : false}
            />
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
            !watch('isRegex') && (
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
                      setIsEntriesActive={setIsEntriesActive}
                      setIsSaveBtnActive={setIsSaveBtnActive}
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
                  ).length === 0 && <EmptyEntry searchKeyword={searchKeyword} />}
              </>
            )
          )}
        </Space>
      </Space>
    </Card>
  );
};
