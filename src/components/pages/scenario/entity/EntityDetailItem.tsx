import { Col, Input } from '@components';
import { IEntriesModel, ISaveEntryGroup } from '@models';
import { FC } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

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
      ></Input>
      <div className="entryList">
        <div className="entries">
          {fields.map((entry, i) => (
            <div key={i}>
              <input
                {...register(`entries.${index}.synonym.${i}`)}
                style={{ width: 'fitContent' }}
              />
            </div>
          ))}
          <div className="addBtnWrapper">
            <button type="button" className="addBtn" onClick={() => append('xxx')}>
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
      <button className="icDelete" />
    </Col>
  );
};
