import { Input } from '@components';
import { useHistoryViewerMatch, usePage, useRootState } from '@hooks';
import { ImageAspectRatio, TImageTypes } from '@models';
import { ChangeEvent, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { handleImageCtrlIdPath } from './handleImageCtrlIdPath';

interface IImageCtrlIdPathProps {
  imageCtrl: TImageTypes;
  index?: number;
  listItemIndex?: number;
  imageRatio?: ImageAspectRatio | undefined;
  isValid?: boolean;
}

export const ImageInput = ({
  imageCtrl,
  index,
  listItemIndex,
}: IImageCtrlIdPathProps) => {
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const { t } = usePage();
  const { setValue } = useFormContext();

  const isHistoryViewer = useHistoryViewerMatch();
  const token = useRootState((state) => state.botInfoReducer.token);
  const { imageUrl } = handleImageCtrlIdPath({ imageCtrl, index, listItemIndex });

  const handleImgUrlInput = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('@handle input img url check', e.target.value);

    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      if (e.target.value.trim()) {
        setValue(
          imageUrl,
          `${import.meta.env.VITE_API_BASE_URL}/builderimage/forbuilder?origin=${
            e.target.value
          }&sessionToken=${token}`,
        );
      }
    }, 1000);

    setTimer(newTimer);
  };

  return (
    <>
      <span className="subLabel">{t(`IMAGE_DIRECT_INPUT`)}</span>
      <Input
        placeholder={t(`DATA_CARD_NODE_IMAGE_INPUT_PLACEHOLDER`)}
        readOnly={isHistoryViewer}
        onChange={handleImgUrlInput}
      />
    </>
  );
};
