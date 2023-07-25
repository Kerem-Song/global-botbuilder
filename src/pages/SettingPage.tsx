import { TitleHelmet } from '@components';
import { SettingComponent } from '@components/pages/bot-setting/SettingComponent';
import { PageProvider } from '@hooks';
import { FC } from 'react';

export const SettingPage: FC = () => {
  return (
    <PageProvider pageName="setting">
      <TitleHelmet />
      <SettingComponent />
    </PageProvider>
  );
};

export default SettingPage;
