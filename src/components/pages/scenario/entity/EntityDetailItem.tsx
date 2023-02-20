import { Button, Col, Input } from '@components';
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
          <AddEntryBtn entryGroup={entryGroup} />
        </div>
      </div>
      <button
        className="icDelete"
        onClick={() => {
          fields.map((entry, i) => {
            remove(i);
          });
        }}
      />
    </Col>
  );
};
