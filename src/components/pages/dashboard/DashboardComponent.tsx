import usePage from '../../../hooks/usePage';
import { Button } from '../../general/Button';

export const DashboardComponent = () => {
  const { pageName, t, tc } = usePage();
  return (
    <>
      <div>{pageName}</div>
      <div>{t('HELLO')}</div>
      <div>{t('WELCOME', { who: '가인' })}</div>
      <div>{tc('SAVE')}</div>
      <div className="capitalize">{tc('SAVE')}</div>
      <div className="uppercase">{tc('SAVE')}</div>
      <Button href="https://www.lunasoft.co.kr">{tc('SAVE')}</Button>
    </>
  );
};
