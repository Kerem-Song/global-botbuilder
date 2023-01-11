import { icDelete, icDuplication, icInsta, icLine, icPaste } from '@assets';
import { Switch } from '@components/data-entry/Switch';
import { Popper } from '@components/navigation/Popper/Popper';
import { useForm } from 'react-hook-form';

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
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <Switch {...register('checked')} />
        <input type="submit" />
      </form> */}
      <>
        <Popper
          popperItems={[
            { id: '1', name: 'ChatbotName1', icon: icInsta },
            { id: '2', name: 'ChatbotName2', icon: icLine },
            { id: '3', name: 'ChatbotNameisc.....', icon: icLine },
            { id: '4', name: 'List View', type: 'button' },
          ]}
          showBullet
        >
          <button className="popperButton">Reference element</button>
        </Popper>
        <Popper popup popupList>
          <button className="popperButton">Reference element</button>
        </Popper>
        <Popper
          popperItems={[
            {
              id: '1',
              name: 'Duplication',
              type: 'icon-front',
              icon: icDuplication,
            },
            {
              id: '2',
              name: 'To paste',
              type: 'icon-front',
              icon: icPaste,
            },
            {
              id: '3',
              name: 'Delete',
              type: 'icon-front',
              icon: icDelete,
            },
          ]}
          popup
          popupList
        >
          <button className="popperButton">Reference element</button>
        </Popper>
      </>
    </PageProvider>
  );
};

export default TestPage;
