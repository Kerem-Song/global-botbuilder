import { Input } from '@components';
import { Collapse } from '@components/general/Collapse';
import { usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { IAnswerView } from '@models/interfaces/res/IGetFlowRes';
import classnames from 'classnames';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { QuicksEdit } from './QuicksEdit';

export const AnswerNodeEdit = () => {
  const { t } = usePage();
  const {
    trigger,
    register,
    getValues,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IAnswerView>>();
  const use = watch('view.useUtteranceParam');

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'view.useUtteranceParam' && type === 'change') {
        if (!value.view?.useUtteranceParam) {
          setValue('view.utteranceParam', undefined);
        }
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  return (
    <>
      <Collapse label={t('USER_ANSWER')} useSwitch={true} field={'useUtteranceParam'}>
        <div className="m-b-8">
          <span className="subLabel">{t('VARIABLE_SETTING')} </span>
          <span className="required">*</span>
        </div>
        <div className={classnames('input', { 'disabled ': !use })}>
          <Input
            {...register(`view.utteranceParam`)}
            placeholder={t('INPUT_VARIABLE_PLACEHOLDER')}
            disabled={!use}
          />
        </div>
      </Collapse>
      <QuicksEdit />
    </>
  );
};
