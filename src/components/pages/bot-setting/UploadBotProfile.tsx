import { icEmptyBotIcon, icHelp, icImg, icTooltipIcon } from '@assets';
import { Button, Col, Row, Space } from '@components';
import { Tooltip } from '@components/navigation/Tooltip';
import {
  imageUploadClient,
  useBotClient,
  usePage,
  useRootState,
  useSystemModal,
} from '@hooks';
import { IUpdateBotIcon } from '@models/interfaces/IBotSetting';
import { lunaToast } from '@modules/lunaToast';
import classNames from 'classnames';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';

export interface IUploadBotProfileProps {
  isProfileSaveBtnActive: boolean;
  setIsProfileSaveBtnActive: Dispatch<SetStateAction<boolean>>;
  setIsSaveBtnsActive: Dispatch<
    SetStateAction<{
      isSaveBtnActive: boolean;
      isProfileSaveBtnActive: boolean;
    }>
  >;
}

export const UploadBotProfile: FC<IUploadBotProfileProps> = ({
  isProfileSaveBtnActive,
  setIsProfileSaveBtnActive,
  setIsSaveBtnsActive,
}) => {
  const [iconImage, setIconImage] = useState<File | null>();
  const { t } = usePage();
  const { isLoadingImageUpload, imageUploadAsync } = imageUploadClient();
  const { botImageUploadAsync } = useBotClient();
  const { error } = useSystemModal();
  const { getValues: getBotIconValues, setValue } = useForm<IUpdateBotIcon>();
  const values = getBotIconValues();
  const botProfileInputRef = useRef<HTMLInputElement>(null);
  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
  const token = useRootState((state) => state.botInfoReducer.token);
  const iconUrl = values.iconUrl || botInfo?.iconUrl;
  const displayIcon = iconUrl ? iconUrl : icEmptyBotIcon;
  const settingBotProfileInfo = t('TOOLTIP_SETTING_BOT_PROFILE_INFO');

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
          console.log('upload 실패', err);
        });
    } else {
      console.log('upload 파일이 없음');
    }
  };

  const handleChangeBotProfile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const ALLOWED_FILE_SIZE = 3 * 1000 * 100; // 300KB 제한
    const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']; //jpg, png가능

    const file = e.target.files && e.target.files[0];

    if (!file) {
      return;
    }

    if (!SUPPORTED_FORMATS.includes(file.type)) {
      await error({
        title: t('VALIDATION_UPLOAD_FILE_FORMAT_TITLE'),
        description: <span>{t('VALIDATION_UPLOAD_FILE_FORMAT')}</span>,
      });
      return;
    }

    if (file.size > ALLOWED_FILE_SIZE) {
      e.target.files = null;
      e.target.value = '';
      await error({
        title: t('VALIDATION_UPLOAD_FILE_SIZE_TITLE'),
        description: (
          <span style={{ whiteSpace: 'pre-wrap' }}>
            {t('VALIDATION_UPLOAD_FILE_SIZE')}
          </span>
        ),
      });
      return;
    }
    setIconImage(file);
    setIsProfileSaveBtnActive(true);
    setIsSaveBtnsActive((prev) => ({ ...prev, isProfileSaveBtnActive: true }));
  };

  const handleSaveProfile = async () => {
    if (botInfo) {
      const send = {
        iconUrl: values.iconUrl,
        botId: botInfo.id,
      };

      const res = await botImageUploadAsync(send);

      if (res) {
        console.log('res', res);
        lunaToast.success(t('SAVE_BOT_PROFILE_MESSAGE'));
        setIsProfileSaveBtnActive(false);
        setIsSaveBtnsActive((prev) => ({
          ...prev,
          isProfileSaveBtnActive: false,
        }));
      }
    }
  };

  useEffect(() => {
    if (token && !!iconImage) {
      handleUploadImage();
    }
  }, [iconImage]);

  return (
    <Row gap={10} align="center">
      <Col className="botInfo botProfileTooltip">
        <p>{t('BOT_PROFILE')}</p>
        <Tooltip tooltip={settingBotProfileInfo} placement="bottom-start">
          <img className="icTooltipIcon" src={icTooltipIcon} alt="help" />
        </Tooltip>
      </Col>
      <Col flex="auto" className="botInfo botProfileImgwrap">
        <Space>
          <div
            className={classNames('icImgWrap', {
              'bot-profile-img-wrap': iconUrl,
            })}
          >
            {isLoadingImageUpload ? null : <img src={displayIcon} alt="iconImg" />}
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
              <Space>
                <Button type="lineBlue" onClick={handleUpload}>
                  {t('FILE_UPLOAD')}
                </Button>
                <Button
                  type="primary"
                  onClick={handleSaveProfile}
                  disabled={!isProfileSaveBtnActive}
                >
                  {t('PROFILE_SAVE')}
                </Button>
              </Space>
              <span className="info">{t('RECOMMEND_BOT_IMG_SIZE')}</span>
            </div>
          </Space>
        </Space>
      </Col>
    </Row>
  );
};
