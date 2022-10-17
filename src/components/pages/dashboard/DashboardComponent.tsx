import usePage from '../../../hooks/usePage';
import { Card } from '../../data-display/Card';
import { Button } from '../../general/Button';

export const DashboardComponent = () => {
  const { pageName, t, tc } = usePage();
  return (
    <>
      <Card title={pageName} style={{ width: '200px' }} radius={20}>
        <div>{t('HELLO')}</div>
        <div>{t('WELCOME', { who: '가인' })}</div>
        <div>{tc('SAVE')}</div>
        <div>길이가 길면 어떻게 나오는지 보고 싶어.</div>
        <div className="capitalize">{tc('SAVE')}</div>
        <div className="uppercase">{tc('SAVE')}</div>
      </Card>
      <Card>
        <Button href="https://www.lunasoft.co.kr">{tc('SAVE')}</Button>
        <Button>{tc('SAVE')}</Button>
      </Card>
    </>
  );
};
