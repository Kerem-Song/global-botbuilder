import { Button } from '@components';
import { usePage, useSystemModal } from '@hooks';
import { useDeployClient } from '@hooks/client/deployClient';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { DeployHistoryList } from './DeployHistoryList';
import { DeployingModal } from './DeployingModal';
import { DeployPagination } from './DeployPagination';

export const Deploy = () => {
  const { botId } = useParams();
  const { getDeployHistoryListQuery } = useDeployClient();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const countPerPage = 30;
  const [isOpenDeployingModal, setIsOpenDeployingModal] = useState(false);
  const { data } = getDeployHistoryListQuery({
    pageNo: currentPage,
    countPerPage: countPerPage,
    botId: botId!,
  });

  const { t } = usePage();
  const { confirm } = useSystemModal();

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

  useEffect(() => {
    if (data) {
      setTotalPages(data?.result.totalPage);
    }
  }, [data]);

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
      <div className="deployHistoryListWrap">
        <DeployHistoryList data={data} />
      </div>
      <DeployPagination
        data={data}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      {isOpenDeployingModal && (
        <DeployingModal isOpenDeployingModal={isOpenDeployingModal} />
      )}
    </div>
  );
};
