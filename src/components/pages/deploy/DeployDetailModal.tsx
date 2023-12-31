import { Button, Divider, Space } from '@components';
import { Title } from '@components/general';
import { usePage } from '@hooks';
import { useDeployClient } from '@hooks/client/deployClient';
import { usePrompt } from '@hooks/usePrompt';
import { IDeployResult, IUpdateDeployHistoryComment } from '@models/interfaces/IDeploy';
import { lunaToast } from '@modules/lunaToast';
import { util } from '@modules/util';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';

export interface IDeployDetailModalProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
  detailInfo: Record<string, never>;
}

export const DeployDetailModal: FC<IDeployDetailModalProps> = ({
  isOpen,
  handleIsOpen,
  detailInfo,
}) => {
  const { t, tc } = usePage();
  const [deployResult, setDeployResult] = useState<IDeployResult[]>([
    { value: 0, message: t('UNKNOWN_ERROR') },
    { value: 1, message: t('SUCCESS') },
    { value: 2, message: t('ALREADY_DEPLOIED_SNS_CHANNEL') },
    { value: 3, message: t('S3_CONNECTION_FAIL') },
    { value: 6, message: t('CHANNEL_NOT_ACTIVATED') },
    { value: 8, message: t('INVALIDATE_FLOW_GROUP') },
    { value: 9, message: t('CHANNEL_NOT_FOUND') },
    { value: 10, message: t('CHANNEL_NOT_USING_BY_PS_CENTER') },
  ]);
  const { updateDeployHistoryCommentAsync } = useDeployClient();
  const {
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { isDirty },
  } = useForm<IUpdateDeployHistoryComment>();

  const { field } = useController({ name: 'comment', control: control });

  usePrompt(isDirty);

  const handleCancel = () => {
    handleIsOpen(false);
  };

  const handleSave = async () => {
    const updateComment: IUpdateDeployHistoryComment = {
      comment: getValues('comment'),
      deployHistoryId: detailInfo.id,
    };

    const res = await updateDeployHistoryCommentAsync(updateComment);

    if (res && res.isSuccess) {
      lunaToast.success(t('SAVE_MEMO'));
      reset();
      handleCancel();
    }
  };

  useEffect(() => {
    if (detailInfo.comment) {
      const resetValue = {
        comment: detailInfo.comment,
        deployHistoryId: detailInfo.id,
      };
      reset(resetValue);
    }
  }, [detailInfo]);

  useEffect(() => {
    if (detailInfo.deployResult) {
      const currentDeployResult = deployResult.filter(
        (x) => x.value === detailInfo.deployResult,
      );
      setDeployResult(currentDeployResult);
    }
  }, [detailInfo.deployResult]);

  return (
    <ReactModal
      style={{ overlay: { display: 'flex' } }}
      className="deployDetailModal"
      isOpen={isOpen}
      onRequestClose={handleCancel}
    >
      <div className="title">
        <Title level={4}>{t('TITLE')}</Title>
      </div>
      <Divider />
      <div className="contents">
        <div className="deployNumber">
          {t('DEPLOY_NUMBER')} : {detailInfo.no} (
          {detailInfo.isLive ? t('OPERATIONAL') : t('TEST')})
        </div>
        <div className="deployInfo">
          <div className="info">
            <span className="infoTitle">{t('CHANNEL_NAME')}</span>
            <span className="infoContent">
              {detailInfo.snsChannel ? detailInfo.snsChannel : '-'}
            </span>
          </div>
          <div className="info">
            <span className="infoTitle">{t('DEPLOYMENT_DATE_AND_TIME')}</span>
            <span className="infoContent">
              {util.toLocaleDateTimeString(new Date(detailInfo.createAt))}
            </span>
          </div>
          <div className="info">
            <span className="infoTitle">{t('OPERATOR')}</span>
            <span className="infoContent">{detailInfo.actorName}</span>
          </div>
          <div className="info">
            <span className="infoTitle">{t('ACCOUNT')}</span>
            <span className="infoContent">{detailInfo.actorEmail}</span>
          </div>
          <div className="info">
            <span className="infoTitle">{t('DEPLOYMENT_STATUS')}</span>
            <span className="infoContent">
              <span
                className={classNames('success', {
                  failed: detailInfo.isSuccess === false,
                })}
              >
                {detailInfo.isSuccess ? t('SUCCESS') : t('FAILED')}
              </span>
              {deployResult
                .filter((x) => x.value !== 1)
                .map((x, i) => (
                  <span className="deployResult" key={i}>
                    ({x.value} : {x.message})
                  </span>
                ))}
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit(handleSave)}>
          <textarea
            className="deployNotes"
            placeholder={t('DEPLOY_NOTES')}
            ref={(e) => {
              field.ref(e);
            }}
            value={field.value}
            onChange={(e) => {
              field.onChange(e);
            }}
          />
        </form>
        <div className="modalBtns">
          <Space>
            <Button className="min-w-100" onClick={handleCancel}>
              {tc('CANCEL')}
            </Button>
            <Button
              className="min-w-100"
              type="primary"
              disabled={!isDirty}
              onClick={handleSave}
            >
              {tc('SAVE')}
            </Button>
          </Space>
        </div>
      </div>
    </ReactModal>
  );
};
