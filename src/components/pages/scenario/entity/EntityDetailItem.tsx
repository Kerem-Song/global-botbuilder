import { Col, Row } from '@components';
import { useSystemModal } from '@hooks';
import { ISaveEntryGroup } from '@models';
import { util } from '@modules/util';
import { FC, useEffect, useRef, useState } from 'react';
import {
  FieldArrayWithId,
  useController,
  UseFieldArrayRemove,
  useFormContext,
} from 'react-hook-form';

import { AddEntryBtn } from './AddEntryBtn';

export interface IEntityDetailItemProps {
  index: number;
  entriesRemove: UseFieldArrayRemove;
  searchKeyword: string;
  entryGroup: FieldArrayWithId<ISaveEntryGroup, 'entries', 'id'>;
  setIsActive: (value: boolean) => void;
}

export const EntityDetailItem: FC<IEntityDetailItemProps> = ({
  index,
  entriesRemove,
  searchKeyword,
  setIsActive,
}) => {
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editInputRef.current?.focus();
  }, []);

  const { control } = useFormContext<ISaveEntryGroup>();
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

  if (
    searchKeyword === '' ||
    (searchKeyword && field.value.includes(searchKeyword)) ||
    (searchKeyword && synonymField.value?.find((x: string) => x.includes(searchKeyword)))
  ) {
    return (
      <Row gap={8}>
        <Col span={5}>
          <div className="representativeEntry">
            <span>{util.replaceKeywordMark(field.value, searchKeyword)}</span>
          </div>
        </Col>
        <Col span={18}>
          <div className="entryList">
            <div className="entries">
              <AddEntryBtn
                index={index}
                searchKeyword={searchKeyword}
                synonym={synonymField.value}
                representativeEntry={field.value}
                setIsActive={setIsActive}
              />
            </div>
          </div>
        </Col>
        <Col span={1}>
          <button type="button" className="icDelete" onClick={openDeleteEntryModal} />
        </Col>
      </Row>
    );
  } else {
    return <></>;
  }
};
