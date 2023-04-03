import { Col, FormItem, Input, Row } from '@components';
import { useSystemModal } from '@hooks';
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

import { AddEntryBtn } from './AddEntryBtn';

export interface IEntityDetailItemProps {
  index: number;
  entriesRemove: UseFieldArrayRemove;
  searchKeyword: string;
  entryGroup: FieldArrayWithId<ISaveEntryGroup, 'entries', 'id'>;
  setIsActive: (value: boolean) => void;
  trigger: UseFormTrigger<ISaveEntryGroup>;
}

export const EntityDetailItem: FC<IEntityDetailItemProps> = ({
  index,
  entriesRemove,
  searchKeyword,
  entryGroup,
  setIsActive,
  trigger,
}) => {
  const [editInputIndex, setEditInputIndex] = useState<number>(-1);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editInputRef.current?.focus();
  }, []);

  const {
    control,
    formState: { errors },
  } = useFormContext<ISaveEntryGroup>();
  const { confirm } = useSystemModal();
  const openDeleteEntryModal = async () => {
    const result = await confirm({
      title: '엔트리 그룹 삭제',
      description: (
        <span>
          그룹에 있는 모든 엔트리가 삭제됩니다.
          <br />
          삭제하시겠습니까?
        </span>
      ),
    });

    if (result) {
      entriesRemove(index);
      setIsActive(true);
    }
  };

  const { field: synonymField } = useController({
    control,
    name: `entries.${index}.synonym`,
  });

  const { field } = useController({
    name: `entries.${index}.representativeEntry`,
    control,
  });

  const handleRepresentativeEntry = () => {
    setIsActive(true);
    setEditInputIndex(-1);
    trigger(`entries.${index}.representativeEntry`);
  };

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
                className={classNames('entryList', {
                  error: errors.entries?.[index]?.representativeEntry,
                })}
              >
                <div className="entries">
                  <AddEntryBtn
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
              <button type="button" className="icDelete" onClick={openDeleteEntryModal} />
            </Col>
          </Row>
        ))}
      </>
    );
  } else {
    return <></>;
  }
};
