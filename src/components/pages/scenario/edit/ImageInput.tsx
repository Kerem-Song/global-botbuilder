import { Input, InputTextarea } from '@components';
import { useHistoryViewerMatch, usePage, useRootState } from '@hooks';
import { ImageAspectRatio, TImageTypes } from '@models';
import { useFormContext } from 'react-hook-form';

import { handleImageCtrlIdPath } from './handleImageCtrlIdPath';

interface IImageCtrlIdPathProps {
  imageCtrl: TImageTypes;
  index?: number;
  listItemIndex?: number;
  imageRatio?: ImageAspectRatio | undefined;
  isValid?: boolean;
  registerName: string;
}

export const ImageInput = ({
  imageCtrl,
  index,
  listItemIndex,
  registerName,
}: IImageCtrlIdPathProps) => {
  const { t } = usePage();
  const { setValue, register } = useFormContext();

  const isHistoryViewer = useHistoryViewerMatch();
  const token = useRootState((state) => state.botInfoReducer.token);
  const { imageUrl, imgPath } = handleImageCtrlIdPath({
    imageCtrl,
    index,
    listItemIndex,
  });

  const handleImgOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
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
    <>
      <span className="subLabel">{t(`IMAGE_DIRECT_INPUT`)}</span>
      <Input
        {...register(registerName)}
        placeholder={t(`DATA_CARD_NODE_IMAGE_INPUT_PLACEHOLDER`)}
        readOnly={isHistoryViewer}
        onBlur={handleImgOnBlur}
        // maxRows={2.125}
        // minRows={2.125}
      />
    </>
  );
};
