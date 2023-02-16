import { icImg } from '@assets';
import { Col, Row, Space } from '@components/layout';
import { useRootState } from '@hooks';
import { imageUploadClient } from '@hooks/client/uploadImageClient';
import { ImageAspectRatio } from '@models/enum';
import { IMAGE_CTRL_TYPES, TImageTypes } from '@models/types/ImageType';
import { Dispatch, SetStateAction } from 'react';
import { useFormContext } from 'react-hook-form';
interface IImageSetting {
  imageRatio: ImageAspectRatio | undefined;
  setImageRatio: Dispatch<SetStateAction<ImageAspectRatio | undefined>>;
  imageCtrl: TImageTypes;
  index?: number;
}

export const ImageSettings = ({
  imageRatio,
  setImageRatio,
  imageCtrl,
  index,
}: IImageSetting) => {
  const { register, getValues, setValue } = useFormContext();
  const values = getValues();

  const { imageUploadAsync } = imageUploadClient();
  const token = useRootState((state) => state.botInfoReducer.token);

  console.log('image ctrl', imageCtrl);
  const handleImageCtrlIdPath = () => {
    switch (imageCtrl) {
      case IMAGE_CTRL_TYPES.IMAGE_CTRL:
        return {
          imageCtrl: values.view.imageCtrl,
          imageFilePath: 'view.imageCtrl',
        };

      case IMAGE_CTRL_TYPES.LIST_ITEM_IMAGE_CTRL:
        return {
          imageCtrl: values.view.items[index!],
          imageFilePath: `view.items.${index}`,
        };

      case IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL:
        return {
          imageCtrl: values.view.childrenViews[index!],
          imageFilePath: `view.childrenViews.${index}`,
        };

      case IMAGE_CTRL_TYPES.LIST_CAROUSEL_ITEM_IMAGE_CTRL:
        return {
          imageCtrl: values.view.childrenViews[index!]?.items[index!],
          imageFilePath: `view.childrenViews.${index}.items.${index}`,
        };

      default:
        return { imageCtrlIdPath: '', imageFilePath: '' };
    }
  };

  const handleUploadImage = async () => {
    if (
      token &&
      getValues(handleImageCtrlIdPath().imageFilePath + `.imageFile`).length > 0
    ) {
      const formData = new FormData();
      formData.append(
        'File',
        getValues(handleImageCtrlIdPath().imageFilePath + `.imageFile`)[0],
      );
      formData.append('SessionToken', token);
      formData.append('CtrlId', handleImageCtrlIdPath().imageCtrl.id);

      imageUploadAsync({ formData })
        .then((res) => {
          console.log('res.data image', res?.data);
          setValue(handleImageCtrlIdPath().imageFilePath + `.imageUrl`, res?.data.result);
          setValue(handleImageCtrlIdPath().imageFilePath + `.imageFile`, null);
        })
        .catch((err) => {
          setValue(handleImageCtrlIdPath().imageFilePath + `.imageUrl`, null);
          setValue(handleImageCtrlIdPath().imageFilePath + `.imageFile`, null);
          //modal 띄우기?
          console.log('upload 실패', err);
        });
    } else {
      console.log('upload 파일이 없음');
    }
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log('file', e.target.files);
      setValue(handleImageCtrlIdPath().imageFilePath + `.imageFile`, e.target.files);

      console.log(
        'handleImageCtrlIdPath',
        handleImageCtrlIdPath().imageFilePath + `.imageFile`,
      );
    }
  };

  return (
    <Space direction="vertical">
      <div className="m-b-8">
        <span className="subLabel">이미지 업로드 </span>
        <span className="required">*</span>
      </div>

      <span className="subLabel">이미지 타입</span>
      <Row justify="space-between">
        <Col span={12} className="radioContainer">
          <input
            className="radio"
            {...register(handleImageCtrlIdPath().imageFilePath + `.aspectRatio`, {
              valueAsNumber: true,
            })}
            type="radio"
            value={ImageAspectRatio.Rectangle}
            checked={
              Number(handleImageCtrlIdPath().imageCtrl.aspectRatio) ===
              ImageAspectRatio.Rectangle
            }
            onClick={() => setImageRatio(ImageAspectRatio.Rectangle)}
          />
          <span>직사각형</span>
        </Col>
        <Col span={12} className="radioContainer">
          <input
            className="radio"
            {...register(handleImageCtrlIdPath().imageFilePath + `.aspectRatio`, {
              valueAsNumber: true,
            })}
            type="radio"
            value={ImageAspectRatio.Square}
            checked={
              Number(handleImageCtrlIdPath().imageCtrl.aspectRatio) ===
              ImageAspectRatio.Square
            }
            onClick={() => setImageRatio(ImageAspectRatio.Square)}
          />
          <span>정사각형</span>
        </Col>
      </Row>

      <label htmlFor="imgUpload" className="imgUploadLabel">
        <div
          className="imgUploadWrapper"
          style={{
            height: imageRatio === ImageAspectRatio.Rectangle ? `118px` : '200px',
            border: '1px dashed #DCDCDC',

            borderRadius: '8px',
            position: 'relative',
          }}
        >
          <div
            className="imgUploadSkeleton"
            style={{
              position: 'absolute',
              textAlign: 'center',
              width: '200px',
              bottom: '50%',
              right: '50%',
              transform: 'translate(50%, 50%)',
            }}
          >
            {handleImageCtrlIdPath().imageCtrl.imageUrl ? (
              <img src={handleImageCtrlIdPath().imageCtrl.imageUrl} alt="templateImage" />
            ) : (
              <>
                <img src={icImg} alt="icImg" />
                <br />
                Recommended
                <br />
                Rectangular: 800 x 400
              </>
            )}

            <input
              type="file"
              id="imgUpload"
              accept="image/png, image/jpeg, image/jpg"
              className="file-name-input"
              onChange={handleChangeFile}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </label>
      <button onClick={handleUploadImage} type="button">
        test
      </button>
    </Space>
  );
};
