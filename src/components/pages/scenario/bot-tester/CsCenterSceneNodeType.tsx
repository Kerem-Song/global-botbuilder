import { useI18n } from '@hooks';
import { FC } from 'react';

export interface ICsCenterSceneNodeTypeProps {
  handleRefresh: () => Promise<void>;
}

export const CsCenterSceneNodeType: FC<ICsCenterSceneNodeTypeProps> = ({
  handleRefresh,
}) => {
  // 상담원 연결 노드 호출한 경우 노출될 UI
  const { t } = useI18n('botTest');

  return (
    <div className="csCenterSceneWrapper">
      <div className="csCenterSceneDivider">
        <div className="divider" />
        <span className="csCenterSceneTitle">{t('CS_CENTER_SCENE_TITLE')}</span>
        <div className="divider" />
      </div>
      <div className="csCenterScene">
        <div className="csCenterScenceDesc">{t('CS_CENTER_SCENE_DESC')}</div>
        <button className="csCenterButton" onClick={handleRefresh}>
          {t('RESTART_BOT_TESTER')}
        </button>
      </div>
      <div className="csCenterSceneDivider">
        <div>--------------------------------------------------------------</div>
      </div>
    </div>
  );
};
