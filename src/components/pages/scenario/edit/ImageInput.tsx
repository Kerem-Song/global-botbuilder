import { InputTextarea } from '@components';
import { usePage, useRootState } from '@hooks';
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
    const { isReadOnly } = usePage();
    const { setValue, register } = useFormContext();

    const token = useRootState((state) => state.botInfoReducer.token);
    const { imageUrl, imgPath } = handleImageCtrlIdPath({
      imageCtrl,
      index,
      listItemIndex,
    });

    const handleImgOnBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (!e.target.value) {
        setValue(imgPath, '', { shouldDirty: true });
        setValue(imageUrl, '', { shouldDirty: true });
      } else {
        setValue(
          imgPath,
          `${
            import.meta.env.VITE_API_BASE_URL
          }/builderimage/forbuilder?origin=${e.target.value.trim()}&sessionToken=${token}`,
          { shouldDirty: true },
        );
        setValue(imageUrl, e.target.value.trim(), {
          shouldDirty: true,
        });
      }
    };

    return (
      <div className="imageInput">
        <InputTextarea
          {...register(registerName)}
          placeholder={placeholder}
          readOnly={isReadOnly}
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
