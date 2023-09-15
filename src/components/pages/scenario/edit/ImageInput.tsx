import { InputTextarea } from '@components';
import { useHistoryViewerMatch, useRootState } from '@hooks';
import { ImageAspectRatio, TImageTypes } from '@models';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { handleImageCtrlIdPath } from './handleImageCtrlIdPath';

interface IImageCtrlIdPathProps {
  imageCtrl: TImageTypes;
  index?: number;
  listItemIndex?: number;
  imageRatio?: ImageAspectRatio | undefined;
  isValid?: boolean;
  registerName: string;
  placeholder?: string;
  isSmall?: boolean;
}

export const ImageInput = React.memo(
  ({
    imageCtrl,
    index,
    listItemIndex,
    registerName,
    placeholder,
    isValid,
    isSmall,
  }: IImageCtrlIdPathProps) => {
    const { setValue, register } = useFormContext();

    const isHistoryViewer = useHistoryViewerMatch();
    const token = useRootState((state) => state.botInfoReducer.token);

    const memoizedHandleCtrlIdPath = useMemo(() => {
      const { imageUrl, imgPath } = handleImageCtrlIdPath({
        imageCtrl,
        index,
        listItemIndex,
      });
      return { imageUrl, imgPath };
    }, [imageCtrl, index, listItemIndex]);

    const handleImgOnBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (!e.target.value) {
        setValue(memoizedHandleCtrlIdPath.imgPath, '', { shouldDirty: true });
        setValue(memoizedHandleCtrlIdPath.imageUrl, '', { shouldDirty: true });
      } else {
        setValue(
          memoizedHandleCtrlIdPath.imgPath,
          `${
            import.meta.env.VITE_API_BASE_URL
          }/builderimage/forbuilder?origin=${e.target.value.trim()}&sessionToken=${token}`,
          { shouldDirty: true },
        );
        setValue(memoizedHandleCtrlIdPath.imageUrl, e.target.value.trim(), {
          shouldDirty: true,
        });
      }
    };

    return (
      <div className="imageInput">
        <InputTextarea
          {...register(registerName)}
          placeholder={placeholder}
          readOnly={isHistoryViewer}
          onBlur={handleImgOnBlur}
          maxRows={isSmall ? 1 : 2.125}
          minRows={isSmall ? 1 : 2.125}
          className={classNames({ invalid: !isValid })}
          maxLength={2055}
        />
      </div>
    );
  },
);

ImageInput.displayName = 'ImageInput';
