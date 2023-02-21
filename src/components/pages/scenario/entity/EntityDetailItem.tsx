import { Col, Input } from '@components';
import { useSystemModal } from '@hooks';
import { FC } from 'react';
import {
  useController,
  useFieldArray,
  UseFieldArrayRemove,
  useFormContext,
} from 'react-hook-form';

import { AddEntryBtn } from './AddEntryBtn';

export interface IEntityDetailItemProps {
  index: number;
  entriesRemove: UseFieldArrayRemove;
}

export const EntityDetailItem: FC<IEntityDetailItemProps> = ({
  index,
  entriesRemove,
}) => {
  const { control } = useFormContext();
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: `entries.${index}.synonym`,
  });

  const { field } = useController({
    name: `entries.${index}.representativeEntry`,
    control,
  });

  return (
    <Col>
      <Input
        {...field}
        size="normal"
        style={{
          width: '200px',
          marginRight: '8px',
        }}
      />
      <div className="entryList">
        <div className="entries">
          <AddEntryBtn fields={fields} append={append} remove={remove} index={index} />
        </div>
      </div>
      <button type="button" className="icDelete" onClick={openDeleteEntryModal} />
    </Col>
  );
};
