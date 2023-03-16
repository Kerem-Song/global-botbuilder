import { Button } from '@components';
import { useModalOpen, usePage, useSystemModal } from '@hooks';
import { useState } from 'react';

import { DeployDetailModal } from './DeployDetailModal';
import { DeployHistoryList } from './DeployHistoryList';
import { DeployingModal } from './DeployingModal';
import { DeployPagination } from './DeployPagination';

export const Deploy = () => {
  const { t } = usePage();
  const { confirm } = useSystemModal();
  const { isOpen, handleIsOpen } = useModalOpen();
  const [isOpenDeployingModal, setIsOpenDeployingModal] = useState(false);

  const handleDeployTestChannel = async () => {
    const result = await confirm({
      title: t('DEPLOY_TEST_CHANNEL'),
      description: (
        <span>
          <span style={{ color: 'blue' }}>@루나소프트_라인테스트</span> 채널에
          <br />
          모든 변경사항을 배포하시겠습니까?
        </span>
      ),
    });
    if (result) {
      console.log('배포하기');
      setIsOpenDeployingModal(true);
    } else {
      return;
    }
  };

  const handleDeployOperationalChannel = async () => {
    const result = await confirm({
      title: t('DEPLOY_OPERATIONAL_CHANNEL'),
      description: (
        <span>
          <span style={{ color: 'blue' }}>@루나소프트_라인</span> 채널에
          <br />
          모든 변경사항을 배포하시겠습니까?
        </span>
      ),
    });
    if (result) {
      console.log('배포하기');
      setIsOpenDeployingModal(true);
    } else {
      return;
    }
  };

  return (
    <div className="deployContainer">
      <div className="title">{t('TITLE')}</div>
      <div className="deployInfo">
        <div className="referenceTime">{t('REFERENCE_TIME')} : UTC+09:00</div>
        <div className="deployBtns">
          <Button
            style={{ marginRight: '8px' }}
            type="lineBlue"
            onClick={handleDeployTestChannel}
          >
            {t('DEPLOY_TEST_CHANNEL')}
          </Button>
          <Button type="primary" onClick={handleDeployOperationalChannel}>
            {t('DEPLOY_OPERATIONAL_CHANNEL')}
          </Button>
        </div>
      </div>
      <div
        className="deployHistoryListWrap"
        role="presentation"
        onClick={() => handleIsOpen(true)}
      >
        <DeployHistoryList />
      </div>
      <DeployPagination />
      {isOpen && <DeployDetailModal isOpen={isOpen} handleIsOpen={handleIsOpen} />}
      {isOpenDeployingModal && (
        <DeployingModal isOpenDeployingModal={isOpenDeployingModal} />
      )}
    </div>
  );
};
