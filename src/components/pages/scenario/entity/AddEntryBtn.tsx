import { icPopupClose } from '@assets';
import { Input } from '@components';
import { IEntriesModel } from '@models';
import { FC, useEffect, useRef, useState } from 'react';
import {
  FieldValues,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFormContext,
  UseFormGetValues,
} from 'react-hook-form';

export interface AddEntryBtnProps {
  entryGroup: IEntriesModel;
  fields: Record<'id', string>[];
  append: UseFieldArrayAppend<FieldValues, `entries.${number}.synonym`>;
  remove: UseFieldArrayRemove;
  index: number;
}

export const AddEntryBtn: FC<AddEntryBtnProps> = ({
  entryGroup,
  fields,
  append,
  remove,
  index,
}) => {
  const { control, register } = useFormContext();
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [editInputIndex, setEditInputIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, []);

  const handleDelete = (removeTag: number) => {
    remove(removeTag);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue) {
      append([inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  console.log(fields);

  return (
    <>
      {fields.map((tag, i) => {
        if (editInputIndex === i) {
          return (
            <div key={i} style={{ width: '100px', marginRight: '8px' }}>
              <Input
                className="entryInput"
                {...register(`entries.${index}.synonym.${i}`)}
              ></Input>
            </div>
          );
        } else {
          return (
            <div key={i} className="entry">
              <span
                onDoubleClick={(e) => {
                  setEditInputIndex(i);
                  e.preventDefault();
                }}
              >
                {}
              </span>
              <button
                type="button"
                className="entryDeleteBtn"
                onClick={() => handleDelete(i)}
              >
                <img src={icPopupClose} alt="delete"></img>
              </button>
            </div>
          );
        }
      })}
      {inputVisible ? (
        <Input
          className="visibleInput"
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <div className="addBtnWrapper">
          <button type="button" className="addBtn" onClick={showInput}>
            <span>Add</span>
          </button>
        </div>
      )}
    </>
  );
};
