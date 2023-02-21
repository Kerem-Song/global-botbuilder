import { Button, Col, Input } from '@components';
import { useSystemModal } from '@hooks';
import { IEntriesModel, ISaveEntryGroup } from '@models';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  FieldArrayWithId,
  useController,
  useFieldArray,
  UseFieldArrayRemove,
  useFormContext,
} from 'react-hook-form';

import { AddEntryBtn } from './AddEntryBtn';

export interface IEntityDetailItemProps {
  index: number;
  entryGroup: IEntriesModel;
  entriesRemove: () => void;
}

export const EntityDetailItem: FC<IEntityDetailItemProps> = ({
  index,
  entryGroup,
  entriesRemove,
}) => {
  const entryGroupName = useRef<HTMLInputElement>(null);

  const { confirm } = useSystemModal();

  const { control, register, getFieldState, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `entries.${index}.synonym`,
  });
  console.log('fields', fields);

  const { field } = useController({
    name: `entries.${index}.representativeEntry`,
    control,
  });

  console.log('field', field);

  return (
    <Col>
      <Input
        {...field}
        size="normal"
        style={{
          width: '200px',
          marginRight: '8px',
        }}
        ref={entryGroupName}
      />
      <div className="entryList">
        <div className="entries">
          {fields.map((entry, i) => (
            <div key={i} className="entry">
              <input
                className="entryInput"
                {...register(`entries.${index}.synonym.${i}`)}
              />
            </div>
          ))}
          <AddEntryBtn
            entryGroup={entryGroup}
            fields={fields}
            append={append}
            remove={remove}
            index={index}
          />
        </div>
      </div>
      <button type="button" className="icDelete" onClick={() => entriesRemove()} />
    </Col>
  );
};
