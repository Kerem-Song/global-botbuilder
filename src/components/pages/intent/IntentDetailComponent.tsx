import { useParams } from 'react-router';

import { IntentDetail } from './IntentDetail';

export const IntentDetailComponent = () => {
  const { intentId } = useParams();

  return <IntentDetail intentId={intentId} />;
};
