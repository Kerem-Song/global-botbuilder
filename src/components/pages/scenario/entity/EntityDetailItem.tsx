import { Col, Input } from '@components';
import { IEntriesModel } from '@models';
import { FC } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { AddEntryBtn } from './AddEntryBtn';

export interface IEntityDetailItemProps {
  index: number;
  entryGroup: IEntriesModel;
}

export const EntityDetailItem: FC<IEntityDetailItemProps> = ({ index, entryGroup }) => {
  const { control, register } = useFormContext();
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
        size="normal"
        style={{
          width: '200px',
          marginRight: '8px',
        }}
        {...field}
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
