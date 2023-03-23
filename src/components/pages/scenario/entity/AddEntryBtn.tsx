import { icPopupClose } from '@assets';
import { Input } from '@components';
import { lunaToast } from '@modules/lunaToast';
import { util } from '@modules/util';
import { FC, useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export interface AddEntryBtnProps {
  index: number;
  searchKeyword: string;
  representativeEntry?: string;
  synonym?: string[];
  setIsActive: (value: boolean) => void;
}

export const AddEntryBtn: FC<AddEntryBtnProps> = ({
  index,
  searchKeyword,
  synonym,
  representativeEntry,
  setIsActive,
}) => {
  const { control, register, getValues, reset } = useFormContext();
  const { fields, prepend, remove } = useFieldArray({
    control,
    name: `entries.${index}.synonym`,
  });

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
    setIsActive(true);
  };

  const handleInputConfirm = (value: string) => {
    if (!value || !value.trim()) {
      setInputVisible(false);
      return;
    }

    if (representativeEntry) {
      if (representativeEntry.toLowerCase() === value.toLowerCase()) {
        lunaToast.error('중복되었습니다. 다시 입력해주세요.');
        return;
      } else if (synonym?.find((x) => x.toLowerCase() === value.toLowerCase())) {
        lunaToast.error('중복되었습니다. 다시 입력해주세요.');
        return;
      } else {
        prepend([value]);
        setInputVisible(false);
        setInputValue('');
      }
    }
  };

  return (
    <>
      {fields.map((tag, i) => {
        if (editInputIndex === i) {
          return (
            <div key={i} style={{ width: '100px', marginRight: '8px' }}>
              <Input
                className="entryInput"
                ref={editInputRef}
                // {...register(`entries.${index}.synonym.${i}`)}
                onBlur={() => {
                  setEditInputIndex(-1);
                }}
                onPressEnter={() => {
                  setEditInputIndex(-1);
                }}
              ></Input>
            </div>
          );
        } else {
          return (
            <div
              key={i}
              className="entry"
              onDoubleClick={(e) => {
                setEditInputIndex(i);
                e.preventDefault();
              }}
            >
              <span>
                {util.replaceKeywordMark(
                  getValues(`entries.${index}.synonym.${i}`),
                  searchKeyword,
                )}
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
          onBlur={() => handleInputConfirm(inputValue)}
          onPressEnter={() => handleInputConfirm(inputValue)}
          onPressEsc={() => {
            setInputVisible(false);
            setInputValue('');
          }}
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
