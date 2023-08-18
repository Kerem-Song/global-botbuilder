import { icPopupClose, icUtteranceAdd } from '@assets';
import { Button, Input } from '@components';
import { usePage } from '@hooks';
import { lunaToast } from '@modules/lunaToast';
import { util } from '@modules/util';
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export interface IAddSynonymBtnProps {
  index: number;
  searchKeyword: string;
  representativeEntry?: string;
  synonym?: string[];
  setIsActive: (value: boolean) => void;
  setIsEntriesDuplicateActive: Dispatch<SetStateAction<boolean>>;
  setIsSaveBtnActive: Dispatch<
    SetStateAction<{
      isActive: boolean;
      isEntriesDuplicateActive: boolean;
    }>
  >;
}

export const AddSynonymBtn: FC<IAddSynonymBtnProps> = ({
  index,
  searchKeyword,
  synonym,
  representativeEntry,
  setIsActive,
  setIsEntriesDuplicateActive,
  setIsSaveBtnActive,
}) => {
  const { t } = usePage();
  const { control, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `entries.${index}.synonym`,
  });

  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (removeTag: number) => {
    remove(removeTag);
    setIsActive(true);
    setIsSaveBtnActive((prev) => ({ ...prev, isActive: true }));
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsActive(true);
    setIsSaveBtnActive((prev) => ({ ...prev, isActive: true }));
  };

  const handleInputConfirm = (value: string) => {
    if (!value || !value.trim()) {
      setInputValue('');
      setInputVisible(false);
      setIsEntriesDuplicateActive(false);
      setIsActive(true);
      setIsSaveBtnActive((prev) => ({ ...prev, isActive: true }));
      return;
    }

    if (representativeEntry) {
      if (representativeEntry.trim() === value.trim()) {
        lunaToast.error(t('DUPLICATE_MESSAGE'));
        inputRef.current?.select();
        setIsActive(false);
        setIsEntriesDuplicateActive(true);
        setIsSaveBtnActive((prev) => ({
          ...prev,
          isActive: false,
          isEntriesActive: true,
        }));
      } else if (synonym?.find((x) => x.trim() === value.trim())) {
        lunaToast.error(t('DUPLICATE_MESSAGE'));
        inputRef.current?.select();
        setIsActive(false);
        setIsEntriesDuplicateActive(true);
        setIsSaveBtnActive((prev) => ({
          ...prev,
          isActive: false,
          isEntriesActive: true,
        }));
      } else {
        append([value]);
        setInputValue('');
        setInputVisible(false);
      }
    }
  };

  const handleInputEsc = () => {
    setInputValue('');
    setInputVisible(false);
  };

  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputVisible]);

  return (
    <>
      {fields.map((tag, i) => {
        return (
          <div key={i} className="synonym">
            <span className="synonymText">
              {util.replaceKeywordMark(
                getValues(`entries.${index}.synonym.${i}`),
                searchKeyword,
              )}
            </span>
            <button
              className="synonymDeleteBtn"
              type="button"
              onClick={() => handleDelete(i)}
            >
              <img src={icPopupClose} alt="delete button"></img>
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
          onClear={() => {
            setInputVisible(false);
            setIsEntriesDuplicateActive(false);
            setIsActive(true);
          }}
          onPressEnter={() => handleInputConfirm(inputValue)}
          onPressEsc={handleInputEsc}
          maxLength={125}
        />
      ) : (
        <div className="addEntryBtnWrapper">
          <Button shape="ghost" className="addEntryBtn" onClick={showInput}>
            <img className="addEntryBtnImg" src={icUtteranceAdd} alt="add" />
            <span className="addEntryBtnName">{t('ADD_ENTRY')}</span>
          </Button>
        </div>
      )}
    </>
  );
};
