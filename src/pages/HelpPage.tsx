import { TitleHelmet } from '@components';
import { PageProvider } from '@hooks';
import { FC } from 'react';

export const HelpPage: FC = () => {
  return (
    <PageProvider pageName="help">
      <TitleHelmet />
    </PageProvider>
  );
};

export default HelpPage;
