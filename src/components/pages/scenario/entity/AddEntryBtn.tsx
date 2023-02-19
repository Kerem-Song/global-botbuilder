import { icPopupClose } from '@assets';
import { Input } from '@components';
import { IEntriesModel } from '@models';
import { FC, useEffect, useRef, useState } from 'react';

export interface AddEntryBtnProps {
  entryGroup: IEntriesModel;
}

export const AddEntryBtn: FC<AddEntryBtnProps> = ({ entryGroup }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [editInputIndex, setEditInputIndex] = useState<number>(-1);
  const [editInputValue, setEditInputValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (entryGroup.synonym) {
      setTags(entryGroup.synonym);
    }
  }, []);

  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, []);

  const handleDelete = (removeTag: string) => {
    const newTags = tags.filter((tag) => tag !== removeTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setInputValue('');
  };

  return (
    <>
      {tags.map((tag, i) => {
        if (editInputIndex === i) {
          return (
            <div key={i} style={{ width: '100px', marginRight: '8px' }}>
              <Input
                className="entryInput"
                ref={editInputRef}
                value={editInputValue}
                onChange={handleEditInputChange}
                onBlur={handleEditInputConfirm}
                onPressEnter={handleEditInputConfirm}
              ></Input>
            </div>
          );
        } else {
          return (
            <div key={i} className="entry">
              <span
                onDoubleClick={(e) => {
                  setEditInputIndex(i);
                  setEditInputValue(tag);
                  e.preventDefault();
                }}
              >
                {tag}
              </span>
              <button className="entryDeleteBtn" onClick={() => handleDelete(tag)}>
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
