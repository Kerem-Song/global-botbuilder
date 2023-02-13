import { icImg } from '@assets';
import { Col, Row, Space } from '@components/layout';
import { useHttp, useRootState } from '@hooks';
import { imageUploadClient } from '@hooks/client/uploadImageClient';
import { ImageAspectRatio } from '@models/enum';
import { Dispatch, SetStateAction } from 'react';
import { useFormContext } from 'react-hook-form';

interface IImageSetting {
  imageRatio: ImageAspectRatio | undefined;
  setImageRatio: Dispatch<SetStateAction<ImageAspectRatio | undefined>>;
  index: number;
}

export const CarouselImageSetting = ({
  imageRatio,
  setImageRatio,
  index,
}: IImageSetting) => {
  const { register, getValues, setValue } = useFormContext();
  const values = getValues();

  const { imageUploadAsync } = imageUploadClient();
  const token = useRootState((state) => state.botBuilderReducer.token);

  const ctrlId = values.view.childrenViews[index].imageCtrl.id;
  console.log('ctrl id', ctrlId);

  const handleUploadImage = async () => {
    if (getValues(`view.childrenViews.${index}.imageCtrl.imageFile`).length > 0) {
      const formData = new FormData();
      formData.append(
        'File',
        getValues(`view.childrenViews.${index}.imageCtrl.imageFile`)[0],
      );
      formData.append('SessionToken', token);
      formData.append('CtrlId', ctrlId);

      imageUploadAsync({ formData })
        .then((res) => {
          console.log('res.data image', res?.data);
          setValue(`view.childrenViews.${index}.imageCtrl.imageUrl`, res?.data.result);
          setValue(`view.childrenViews.${index}.imageCtrl.imageFile`, null);
        })
        .catch((err) => {
          setValue(`view.childrenViews.${index}.imageCtrl.imageUrl`, null);
          setValue(`view.childrenViews.${index}.imageCtrl.imageFile`, null);
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
      setValue(`view.childrenViews.${index}.imageCtrl.imageFile`, e.target.files);
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
            {...register(`view.childrenViews.${index}.imageCtrl.aspectRatio`, {
              valueAsNumber: true,
            })}
            type="radio"
            value={ImageAspectRatio.Rectangle}
            checked={
              Number(values.view.imageCtrl.aspectRatio) === ImageAspectRatio.Rectangle
            }
            onClick={() => setImageRatio(ImageAspectRatio.Rectangle)}
          />
          <span>직사각형</span>
        </Col>
        <Col span={12} className="radioContainer">
          <input
            className="radio"
            {...register(`view.childrenViews.${index}.imageCtrl.aspectRatio`, {
              valueAsNumber: true,
            })}
            type="radio"
            value={ImageAspectRatio.Square}
            checked={
              Number(values.view.imageCtrl.aspectRatio) === ImageAspectRatio.Square
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
            {values.view.imageCtrl.imageUrl ? (
              <img src={values.view.imageCtrl.imageUrl} alt="templateImage" />
            ) : (
              <img src={icImg} alt="icImg" />
            )}
            <br />
            Recommended
            <br />
            Rectangular: 800 x 400
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
