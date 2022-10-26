import { TitleHelmet } from '@components/common/TitleHelmet';
import { FC } from 'react';

// import { TitleHelmet } from '../../components/common/TitleHelmet';
import { BotbuilderPage } from '../../components/pages/botbuilder/Botbuilder';
import { PageProvider } from '../../hooks/providers/PageProvider';
export const DashboardPage: FC = () => {
  return (
    <PageProvider pageName="dashboard">
      <TitleHelmet />
      <BotbuilderPage />
    </PageProvider>
  );
};

export default DashboardPage;
