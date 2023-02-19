import { Col, Input } from '@components';
import { useSystemModal } from '@hooks';
import { IEntriesModel } from '@models';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { AddEntryBtn } from './AddEntryBtn';

export interface IEntityDetailItemProps {
  index: number;
  entryGroup: IEntriesModel;
}

export const EntityDetailItem: FC<IEntityDetailItemProps> = ({ index, entryGroup }) => {
  const entryGroupName = useRef<HTMLInputElement>(null);
  const { confirm } = useSystemModal();

  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `entries.${index}.synonym`,
  });

  const { field, fieldState, formState } = useController({
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
        ref={entryGroupName}
      />
      <div className="entryList">
        <div className="entries">
          {/* {fields.map((entry, i) => (
            <div key={i} className="entry">
              <input
                className="entryInput"
                {...register(`entries.${index}.synonym.${i}`)}
              />
            </div>
          ))} */}
          <AddEntryBtn entryGroup={entryGroup} />
        </div>
      </div>
      <button className="icDelete" />
    </Col>
  );
};
