import { FormItem, Input, InputTextarea } from '@components';
import { useHistoryViewerMatch, usePage, useRootState } from '@hooks';
import { ImageAspectRatio, TImageTypes } from '@models';
import classNames from 'classnames';
import { error } from 'console';
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
}

export const ImageInput = ({
  imageCtrl,
  index,
  listItemIndex,
  registerName,
  placeholder,
  isValid,
}: IImageCtrlIdPathProps) => {
  const { t } = usePage();
  const {
    setValue,
    register,
    formState: { errors },
  } = useFormContext();

  const isHistoryViewer = useHistoryViewerMatch();
  const token = useRootState((state) => state.botInfoReducer.token);

  const { imageUrl, imgPath } = handleImageCtrlIdPath({
    imageCtrl,
    index,
    listItemIndex,
  });

  const handleImgOnBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (!e.target.value) {
      setValue(imgPath, '');
      setValue(imageUrl, '');
    } else {
      setValue(
        imgPath,
        `${
          import.meta.env.VITE_API_BASE_URL
        }/builderimage/forbuilder?origin=${e.target.value.trim()}&sessionToken=${token}`,
      );
      setValue(imageUrl, e.target.value.trim());
    }
  };

  return (
    <div className="imageInput">
      <span className="subLabel">{t(`IMAGE_DIRECT_INPUT`)}</span>

      <InputTextarea
        {...register(registerName)}
        placeholder={placeholder}
        readOnly={isHistoryViewer}
        onBlur={handleImgOnBlur}
        maxRows={2.125}
        minRows={2.125}
        className={classNames({ invalid: !isValid })}
      />
    </div>
  );
};
