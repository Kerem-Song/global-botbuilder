import { FC } from 'react';

import { TitleHelmet } from '../components/common/TitleHelmet';
import { PageProvider } from '../hooks/providers/PageProvider';

export const HelpPage: FC = () => {
  return (
    <PageProvider pageName="help">
      <TitleHelmet />
    </PageProvider>
  );
};

export default HelpPage;
