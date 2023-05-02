import { Button, Col, Input, Row } from '@components';
import { usePage, useSystemModal } from '@hooks';
import { ISaveEntryGroup } from '@models';
import { util } from '@modules/util';
import classNames from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';
import {
  FieldArrayWithId,
  useController,
  UseFieldArrayRemove,
  useFormContext,
  UseFormTrigger,
} from 'react-hook-form';

import { AddSynonymBtn } from './AddSynonymBtn';

export interface IEntityDetailItemProps {
  index: number;
  entriesRemove: UseFieldArrayRemove;
  searchKeyword: string;
  entryGroup: FieldArrayWithId<ISaveEntryGroup, 'entries', 'id'>;
  setIsActive: (value: boolean) => void;
  trigger: UseFormTrigger<ISaveEntryGroup>;
}

export const EntryItem: FC<IEntityDetailItemProps> = ({
  index,
  entriesRemove,
  searchKeyword,
  entryGroup,
  setIsActive,
  trigger,
}) => {
  const { t } = usePage();
  const [editInputIndex, setEditInputIndex] = useState<number>(-1);
  const editInputRef = useRef<HTMLInputElement>(null);
  const {
    control,
    formState: { errors },
  } = useFormContext<ISaveEntryGroup>();
  const { confirm } = useSystemModal();
  const { field: synonymField } = useController({
    control,
    name: `entries.${index}.synonym`,
  });
  const { field } = useController({
    name: `entries.${index}.representativeEntry`,
    control,
  });

  const openDeleteEntryModal = async () => {
    const result = await confirm({
      title: t('DELETE_ENTRY_GROUP'),
      description: (
        <p style={{ whiteSpace: 'pre-wrap' }}>{t('DELETE_ENTRY_GROUP_MESSAGE')}</p>
      ),
    });

    if (result) {
      entriesRemove(index);
      setIsActive(true);
    }
  };

  const handleRepresentativeEntry = () => {
    setIsActive(true);
    setEditInputIndex(-1);
    trigger(`entries.${index}.representativeEntry`);
  };

  useEffect(() => {
    editInputRef.current?.focus();
  }, []);

  if (
    searchKeyword === '' ||
    (searchKeyword && field.value.includes(searchKeyword)) ||
    (searchKeyword && synonymField.value?.find((x: string) => x.includes(searchKeyword)))
  ) {
    return (
      <>
        {[entryGroup].map((item, i) => (
          <Row key={i} gap={8}>
            <Col
              span={5}
              className={classNames({ representativeEntryInput: editInputIndex === i })}
            >
              {editInputIndex === i ? (
                <Input
                  {...field}
                  size="normal"
                  maxLength={125}
                  showCount
                  className={classNames({
                    'input-normal': !errors.entries?.[index]?.representativeEntry,
                    'input-error': errors.entries?.[index]?.representativeEntry,
                  })}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  onBlur={handleRepresentativeEntry}
                  onPressEnter={handleRepresentativeEntry}
                  onPressEsc={handleRepresentativeEntry}
                  isError={
                    errors.entries?.[index]?.representativeEntry?.message ? true : false
                  }
                />
              ) : (
                <div
                  className={classNames('representativeEntry', {
                    error: errors.entries?.[index]?.representativeEntry,
                  })}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    setEditInputIndex(i);
                  }}
                >
                  <span>{util.replaceKeywordMark(field.value, searchKeyword)}</span>
                </div>
              )}
              <span className="error-message">
                {errors.entries?.[index]?.representativeEntry?.message}
              </span>
            </Col>
            <Col span={18}>
              <div
                className={classNames('synonymListWrapper', {
                  error: errors.entries?.[index]?.representativeEntry,
                })}
              >
                <div className="synonymList">
                  <AddSynonymBtn
                    index={index}
                    searchKeyword={searchKeyword}
                    representativeEntry={field.value}
                    synonym={synonymField.value}
                    setIsActive={setIsActive}
                  />
                </div>
              </div>
            </Col>
            <Col span={1}>
              <Button className="icDelete" onClick={openDeleteEntryModal} />
            </Col>
          </Row>
        ))}
      </>
    );
  } else {
    return <></>;
  }
};
