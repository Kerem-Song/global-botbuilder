import { icImg } from '@assets';
import { Button, Col, Row, Space } from '@components';
import {
  imageUploadClient,
  useBotClient,
  usePage,
  useRootState,
  useSystemModal,
} from '@hooks';
import { IUpdateBotIcon } from '@models/interfaces/IBotSetting';
import { lunaToast } from '@modules/lunaToast';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export const UploadBotProfile = () => {
  const { t } = usePage();
  const { imageUploadAsync } = imageUploadClient();
  const { botImageUploadAsync } = useBotClient();
  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);

  const token = useRootState((state) => state.botInfoReducer.token);
  const [iconImage, setIconImage] = useState<File | null>();

  const {
    getValues,
    setValue,
    formState: { errors },
  } = useForm<IUpdateBotIcon>();

  const values = getValues();
  const botProfileInputRef = useRef<HTMLInputElement>(null);
  const { error, info } = useSystemModal();

  const handleUpload = useCallback(() => {
    if (!botProfileInputRef.current) {
      return;
    }
    botProfileInputRef.current.click();
  }, [botProfileInputRef]);

  const handleUploadImage = async () => {
    if (token && iconImage) {
      const formData = new FormData();
      formData.append('File', iconImage);
      formData.append('SessionToken', token);
      formData.append('CtrlId', 'profile');

      imageUploadAsync({ formData })
        .then((res) => {
          console.log('res.data image', res?.data);
          setValue('iconUrl', res?.data.result);
          setIconImage(null);
        })
        .catch((err) => {
          setValue('iconUrl', null);
          setIconImage(null);

          //modal 띄우기?
          console.log('upload 실패', err);
        });
    } else {
      console.log('upload 파일이 없음');
    }
  };

  const handleChangeBotProfile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const FILE_SIZE = 3 * 1000 * 100; // 300KB 제한
    const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']; //jpg, png가능

    if (e.target.files) {
      if (!SUPPORTED_FORMATS.includes(e.target.files[0].type)) {
        await error({
          title: t('VALIDATION_UPLOAD_FILE_FORMAT_TITLE'),
          description: <span>{t('VALIDATION_UPLOAD_FILE_FORMAT')}</span>,
        });
        return;
      } else if (e.target.files[0].size > FILE_SIZE) {
        e.target.files = null;
        e.target.value = '';
        await error({
          title: t('VALIDATION_UPLOAD_FILE_EXCEED_TITLE'),
          description: <span>{t('VALIDATION_UPLOAD_FILE_EXCEED')}</span>,
        });
        return;
      }
      setIconImage(e.target.files[0]);
    }
  };

  const handleSaveProfile = async () => {
    if (botInfo) {
      const send = {
        iconUrl: values.iconUrl,
        botId: botInfo.id,
      };

      const res = await botImageUploadAsync(send);

      if (res) {
        lunaToast.success();
      }
    }
  };

  useEffect(() => {
    if (token && !!iconImage) {
      handleUploadImage();
    }
  }, [iconImage]);

  return (
    <form>
      <Row gap={10} align="center">
        <Col className="botInfo">
          <span>{t('BOT_PROFILE')}</span>
        </Col>
        <Col flex="auto" className="botInfo botProfileImgwrap">
          <Space>
            <div className="botProfileImg">
              <img src={values.iconUrl ?? botInfo?.iconUrl ?? icImg} alt="iconImg" />
            </div>
            <input
              type="file"
              className="fileInput"
              ref={botProfileInputRef}
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleChangeBotProfile}
            />
            <Space>
              <div className="botProfileUploadBtnWrap">
                <span className="info">{t('RECOMMEND_BOT_IMG_SIZE')}</span>
                <Space>
                  <Button type="lineBlue" onClick={handleUpload}>
                    {t('FILE_UPLOAD')}
                  </Button>
                  <Button type="primary" onClick={handleSaveProfile}>
                    {t('PROFILE_SAVE')}
                  </Button>
                </Space>
              </div>
            </Space>
          </Space>
        </Col>
      </Row>
    </form>
  );
};
