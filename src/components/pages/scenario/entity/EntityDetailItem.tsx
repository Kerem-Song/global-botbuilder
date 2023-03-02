import { Col, FormItem, Input } from '@components';
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
}

export const EntityDetailItem: FC<IEntityDetailItemProps> = ({
  index,
  entriesRemove,
  searchKeyword,
  entryGroup,
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
      <>
        {[entryGroup].map((item, i) => {
          if (editInputIndex === i) {
            return (
              <Col key={i}>
                <div>
                  <FormItem error={errors.entries?.[index]?.representativeEntry}>
                    <Input
                      {...field}
                      size="normal"
                      style={{
                        width: '200px',
                        height: 'auto',
                        marginRight: '8px',
                      }}
                    />
                  </FormItem>
                </div>
                <div className="entryList">
                  <div className="entries">
                    <AddEntryBtn index={index} searchKeyword={searchKeyword} />
                  </div>
                </div>
                <button
                  type="button"
                  className="icDelete"
                  onClick={openDeleteEntryModal}
                />
              </Col>
            );
          } else {
            return (
              <div key={i}>
                <div className="representativeEntry">
                  <span
                    onDoubleClick={(e) => {
                      setEditInputIndex(i);
                      e.preventDefault();
                    }}
                  >
                    {util.replaceKeywordMark(item.representativeEntry, searchKeyword)}
                  </span>
                </div>
                <div className="entryList">
                  <div className="entries">
                    <AddEntryBtn index={index} searchKeyword={searchKeyword} />
                  </div>
                </div>
                <button
                  type="button"
                  className="icDelete"
                  onClick={openDeleteEntryModal}
                />
              </div>
            );
          }
        })}
      </>
    );
  } else {
    return <></>;
  }
};
