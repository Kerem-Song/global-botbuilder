import { icImg } from '@assets';
import { Col, Row, Space } from '@components/layout';
import { ImageAspectRatio } from '@models/enum/ImageAspectRatio';
import { Dispatch, SetStateAction } from 'react';
import { useFormContext } from 'react-hook-form';

interface IImageSetting {
  imageRatio: ImageAspectRatio | undefined;
  setImageRatio: Dispatch<SetStateAction<ImageAspectRatio | undefined>>;
}

export const ImageSetting = ({ imageRatio, setImageRatio }: IImageSetting) => {
  const { register, getValues } = useFormContext();
  const values = getValues();

  return (
    <Space direction="vertical">
      <div className="m-b-8">
        <span className="subLabel">이미지 업로드 </span>
        <span className="required">*</span>
      </div>

      <span className="subLabel">이미지 타입</span>
      <Row>
        <Col span={12} className="radioContainer">
          <input
            className="radio"
            {...register('view.imageCtrl.aspectRatio', { valueAsNumber: true })}
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
            {...register('view.imageCtrl.aspectRatio', { valueAsNumber: true })}
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
      <div
        style={{
          height: imageRatio === ImageAspectRatio.Rectangle ? `118px` : '200px',
          border: '1px dashed #DCDCDC',
          background: '#FFFFFF',
          borderRadius: '8px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            textAlign: 'center',
            width: '200px',
            bottom: '50%',
            right: '50%',
            transform: 'translate(50%, 50%)',
          }}
        >
          <img src={icImg} alt="icImg" />
          <br />
          Recommended
          <br />
          Rectangular: 800 x 400
        </div>
      </div>
    </Space>
  );
};
