import { useParams } from 'react-router';

import { UtteranceDetail } from './UtteranceDetail';

export const UtteranceDetailComponent = () => {
  const { intentId } = useParams();

  return <UtteranceDetail intentId={intentId} />;
};
