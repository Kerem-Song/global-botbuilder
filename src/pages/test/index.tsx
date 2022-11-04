import Switch from '@components/data-entry/Switch';
import { Button } from '@components/general/Button';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { PageProvider } from '../../hooks/providers/PageProvider';
import useI18n from '../../hooks/useI18n';

interface SampleData {
  checked: boolean;
}

export const TestPage = () => {
  const { i18n, t } = useI18n('test');
  const { register, handleSubmit } = useForm<SampleData>({
    defaultValues: { checked: true },
  });
  const onSubmit = (data: SampleData) => console.log(data);
  return (
    <PageProvider pageName="test">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Switch {...register('checked')} />
        <input type="submit" />
      </form>
    </PageProvider>
  );
};

export default TestPage;
