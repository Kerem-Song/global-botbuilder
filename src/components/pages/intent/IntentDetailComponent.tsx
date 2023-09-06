import { useState } from 'react';
import { useParams } from 'react-router';

import { IntentDetail } from './IntentDetail';

export const IntentDetailComponent = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const { intentId } = useParams();

  return (
    <IntentDetail intentId={intentId} isActive={isActive} setIsActive={setIsActive} />
  );
};
