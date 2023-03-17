import { Button, Divider, InputTextarea, Space } from '@components';
import { Title } from '@components/general';
import { usePage } from '@hooks';
import { useDeployClient } from '@hooks/client/deployClient';
import { IHasResult, IPagingItems } from '@models';
import {
  IResponseSearchDeployHistory,
  IUpdateDeployHistoryComment,
} from '@models/interfaces/IDeploy';
import { lunaToast } from '@modules/lunaToast';
import classNames from 'classnames';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import MultiClamp from 'react-multi-clamp';

export interface IDeployDetailModalProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
  detailInfo: Record<string, never>;
  data: IHasResult<IPagingItems<IResponseSearchDeployHistory>> | undefined;
}

export const DeployDetailModal: FC<IDeployDetailModalProps> = ({
  isOpen,
  handleIsOpen,
  detailInfo,
}) => {
  const { updateDeployHistoryComment } = useDeployClient();
  const { register, handleSubmit, reset, getValues } =
    useForm<IUpdateDeployHistoryComment>();
  const { t, tc } = usePage();

  useEffect(() => {
    if (detailInfo.comment) {
      const resetValue = {
        comment: detailInfo.comment,
        deployHistoryId: detailInfo.id,
      };
      reset(resetValue);
    }
  }, [detailInfo]);

  const handleClose = () => {
    handleIsOpen(false);
  };

  const handleSave = async () => {
    const updateComment: IUpdateDeployHistoryComment = {
      comment: getValues('comment'),
      deployHistoryId: detailInfo.id,
    };
    const res = await updateDeployHistoryComment.mutateAsync(updateComment);
    if (res) {
      lunaToast.success('메모가 저장되었습니다.');
      console.log(res.isSuccess);
    }
  };

  return (
    <ReactModal
      style={{ overlay: { display: 'flex' } }}
      className="deployDetailModal"
      isOpen={isOpen}
    >
      <div className="title">
        <Title level={4}>{t('TITLE')}</Title>
      </div>
      <Divider />
      <div className="contents">
        <div className="deployNumber">
          <Title level={2}>
            {t('DEPLOY_NUMBER')} {detailInfo.no} ({t('OPERATIONAL')})
          </Title>
        </div>
        <div className="deployInfo">
          <div className="info">
            <span className="infoTitle">{t('CHANNEL_NAME')}</span>
            <span className="infoContent">{detailInfo.snsChannel}</span>
          </div>
          <div className="info">
            <span className="infoTitle">{t('DEPLOYMENT_DATE_AND_TIME')}</span>
            <span className="infoContent">{detailInfo.deployedTime}</span>
          </div>
          <div className="info">
            <span className="infoTitle">{t('OPERATOR')}</span>
            <span className="infoContent">
              {detailInfo.actorName}({detailInfo.actorEmail})
            </span>
          </div>
          <div className="info">
            <span className="infoTitle">{t('DEPLOYMENT_STATUS')}</span>
            <span className="infoContent">
              <span
                className={classNames('success', {
                  failed: detailInfo.isSuccess === false,
                })}
              >
                {detailInfo.isSuccess === true ? t('SUCCESS') : t('FAILED')}
              </span>
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit(handleSave)}>
          <InputTextarea
            className="deployNotes"
            placeholder={t('MEMO')}
            {...register('comment')}
          />
        </form>
        <div className="modalBtns">
          <Space>
            <Button className="min-w-100" onClick={handleClose}>
              {tc('CANCEL')}
            </Button>
            <Button className="min-w-100" type="primary" onClick={handleSave}>
              {tc('SAVE')}
            </Button>
          </Space>
        </div>
      </div>
    </ReactModal>
  );
};
