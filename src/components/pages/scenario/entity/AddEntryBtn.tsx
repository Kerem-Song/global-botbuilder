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
  const { control, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `entries.${index}.synonym`,
  });

  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

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
      setInputValue('');
      setInputVisible(false);
      return;
    }

    if (representativeEntry) {
      if (representativeEntry.trim() === value.trim()) {
        lunaToast.error('중복되었습니다. 다시 입력해주세요.');
        inputRef.current?.select();
        return;
      } else if (synonym?.find((x) => x.trim() === value.trim())) {
        lunaToast.error('중복되었습니다. 다시 입력해주세요.');
        inputRef.current?.select();
        return;
      } else {
        append([value]);
        setInputValue('');
        setInputVisible(false);
      }
    }
  };

  return (
    <>
      {fields.map((tag, i) => {
        return (
          <div key={i} className="entry">
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
      })}
      {inputVisible ? (
        <Input
          className="visibleInput"
          clearable
          isShawAlwaysClear
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={() => handleInputConfirm(inputValue)}
          onClear={() => setInputVisible(false)}
          onPressEnter={() => handleInputConfirm(inputValue)}
          onPressEsc={() => {
            setInputVisible(false);
            setInputValue('');
          }}
          maxLength={125}
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
