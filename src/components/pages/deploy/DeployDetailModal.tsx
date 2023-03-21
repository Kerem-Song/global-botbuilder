import { Button, Divider, InputTextarea, Space } from '@components';
import { Title } from '@components/general';
import { usePage } from '@hooks';
import { useDeployClient } from '@hooks/client/deployClient';
import { IDeployResult, IUpdateDeployHistoryComment } from '@models/interfaces/IDeploy';
import { lunaToast } from '@modules/lunaToast';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';

export interface IDeployDetailModalProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
  detailInfo: Record<string, never>;
}

function pad(n: number): string {
  return n < 10 ? `0${n.toString()}` : n.toString();
}

function timestamp(d: Date) {
  return (
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1) +
    '-' +
    pad(d.getDate()) +
    ' ' +
    pad(d.getHours()) +
    ':' +
    pad(d.getMinutes()) +
    ':' +
    pad(d.getSeconds())
  );
}

export const DeployDetailModal: FC<IDeployDetailModalProps> = ({
  isOpen,
  handleIsOpen,
  detailInfo,
}) => {
  const [deployResult, setDeployResult] = useState<IDeployResult[]>([
    { value: 0, message: '알수 없는 오류' },
    { value: 1, message: '성공' },
    { value: 2, message: '이미 다른 곳에서 사용중인 채널' },
    { value: 3, message: 'S3에 연결 실패' },
    { value: 6, message: '채널이 활성화 되어 있지 않음' },
    { value: 8, message: '정상적이지 않은 FlowGroup' },
    { value: 9, message: '채널을 찾지 못함' },
  ]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const { updateDeployHistoryComment } = useDeployClient();
  const { handleSubmit, reset, getValues, control } =
    useForm<IUpdateDeployHistoryComment>();
  const { field } = useController({ name: 'comment', control: control });
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

  useEffect(() => {
    if (detailInfo.deployResult) {
      const currentDeployResult = deployResult.filter(
        (x) => x.value === detailInfo.deployResult,
      );
      setDeployResult(currentDeployResult);
    }
  }, [detailInfo.deployResult]);

  const handleCancel = () => {
    handleIsOpen(false);
  };

  const handleSave = async () => {
    const updateComment: IUpdateDeployHistoryComment = {
      comment: getValues('comment'),
      deployHistoryId: detailInfo.id,
    };
    const res = await updateDeployHistoryComment.mutateAsync(updateComment);
    if (res && res.isSuccess) {
      lunaToast.success();
      reset();
      handleCancel();
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
            {t('DEPLOY_NUMBER')} {detailInfo.no} (
            {detailInfo.isLive ? t('OPERATIONAL') : t('TEST')})
          </Title>
        </div>
        <div className="deployInfo">
          <div className="info">
            <span className="infoTitle">{t('CHANNEL_NAME')}</span>
            <span className="infoContent">{detailInfo.snsChannel}</span>
          </div>
          <div className="info">
            <span className="infoTitle">{t('DEPLOYMENT_DATE_AND_TIME')}</span>
            <span className="infoContent">
              {timestamp(new Date(detailInfo.deployedTime))}
            </span>
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
          <InputTextarea
            className="deployNotes"
            placeholder={t('DEPLOY_NOTES')}
            ref={(e) => {
              field.ref(e);
            }}
            value={field.value}
            onChange={(e) => {
              field.onChange(e);
              setIsActive(true);
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
              disabled={isActive ? false : true}
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
