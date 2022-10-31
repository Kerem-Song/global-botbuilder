import 'react-image-crop/dist/ReactCrop.css';
import '../../styles/imgeditor.scss';

import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop';

import { canvasPreview } from './canvasPreview';
import { useDebounceEffect } from './useDebounceEffect';
// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper consts = .
const centerAspectCrop = (mediaWidth: number, mediaHeight: number, aspect: number) => {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
};

export const ImageEditorComponent = () => {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(1.51 / 1);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const imgSrcClassName = classNames('imgWrapper', { imgSrc: imgSrc });

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate,
        );
      }
    },
    100,
    [completedCrop, scale, rotate],
  );

  const handleToggleAspectClick = () => {
    if (aspect) {
      console.log('aspect', aspect);
      setAspect(undefined);
    } else if (imgRef.current) {
      const { width, height } = imgRef.current;
      setAspect(1.51 / 1);
      setCrop(centerAspectCrop(width, height, 1.51 / 1));
    }
  };

  const handleAspect = (x: number, y: number) => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setAspect(x / y);
      setCrop(centerAspectCrop(width, height, x / y));
    }
  };

  return (
    <div className="imageEditor">
      <div className="imageEditorWrapper">
        <div className="cropControls">
          <input type="file" accept="image/*" onChange={onSelectFile} />
        </div>
        <div className={imgSrcClassName}>
          {imgSrc ? (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          ) : (
            <div className="skeleton">img upload</div>
          )}
        </div>
        <div className="aspectBtnWrapper">
          <button onClick={handleToggleAspectClick}>
            Toggle aspect {aspect ? 'off' : 'on'}
          </button>
          <button onClick={() => handleAspect(1, 1)}>1:1</button>
          <button onClick={() => handleAspect(1.51, 1)}>1.51:1</button>
          <button onClick={() => handleAspect(4, 3)}>4:3</button>
          <button onClick={() => handleAspect(16, 9)}>16:9</button>
        </div>
        <div>
          <input
            className="range"
            type="range"
            name=""
            min="1"
            max="5"
            value={scale}
            disabled={!imgSrc}
            onChange={(e) => setScale(Number(e.target.value))}
          />
          <div className="ratioBtnWrapper">
            <span>x1</span>
            <span>x2</span>
            <span>x3</span>
            <span>x4</span>
            <span>x5</span>
          </div>
        </div>
      </div>

      <div className="result">
        {!!completedCrop && (
          <canvas
            ref={previewCanvasRef}
            style={{
              border: '1px solid black',
              objectFit: 'contain',
              width: completedCrop.width,
              height: completedCrop.height,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ImageEditorComponent;
