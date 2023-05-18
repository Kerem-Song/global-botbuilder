import { useParams } from 'react-router';

import { UtteranceDetail } from './UtteranceDetail';

export const UtteranceDetailComponent = () => {
  const { utteranceId } = useParams();

  return <UtteranceDetail utteranceId={utteranceId} />;
};
