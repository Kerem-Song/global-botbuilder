import { useForm } from 'react-hook-form';
import usePage from '../../../hooks/usePage';
import { Card } from '../../data-display/Card';
import { Input } from '../../data-entry/Input';
import { Button } from '../../general/Button';

interface FormData {
  name: string;
}

export const DashboardComponent = () => {
  const { pageName, t, tc } = usePage();
  const { register, handleSubmit, watch } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  return (
    <>
      <Card title={pageName} style={{ width: '200px' }} radius="x-large">
        <div>{t('HELLO')}</div>
        <div>{t('WELCOME', { who: '가인' })}</div>
        <div>{tc('SAVE')}</div>
        <div>길이가 길면 어떻게 나오는지 보고 싶어.</div>
        <div className="capitalize">{tc('SAVE')}</div>
        <div className="uppercase">{tc('SAVE')}</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input {...register('name')} />
        </form>
      </Card>
      <Card>
        {watch('name')}
        <Button href="https://www.lunasoft.co.kr">{tc('SAVE')}</Button>
        <Button>{tc('SAVE')}</Button>
        <Button shape="circle">S</Button>
      </Card>
    </>
  );
};
