import { useI18n, useSystemModal } from '@hooks';
import { ErrorExecuterType } from '@models/types/errorCodes';

export const useErrorExecuter = () => {
  const { error } = useSystemModal();
  const { tc } = useI18n();
  const errorExecuter: ErrorExecuterType = {
    // 권한이 하나도 없음.
    ROLE_NOT_FOUND: {
      callback: () => {
        error({
          title: tc('HTTP_PROVIDER_NO_BOT_ERROR_TITLE'),
          description: tc('HTTP_PROVIDER_BOT_BUILDER_ERROR_DESC'),
        }).then(() => {
          document.location.href = import.meta.env.VITE_PARTNERS_CENTER_URL;
        });
      },
    },
    ALREADY_EXIST_FLOW_NAME: {},
    DUPLICATE_FLOW_ALIAS: {},
    DUPLICATE_NODE_ID: {},
    FLOW_DELETE: {},
    INVALIDATE_DATA: {},
  };
  return errorExecuter;
};
