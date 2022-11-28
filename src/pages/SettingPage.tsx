import { FC } from 'react';

import { TitleHelmet } from '../components/common/TitleHelmet';
import { PageProvider } from '../hooks/providers/PageProvider';

export const SettingPage: FC = () => {
  return (
    <PageProvider pageName="setting">
      <TitleHelmet />
    </PageProvider>
  );
};

export default SettingPage;
