import { Input, Switch } from '@components';
import { Collapse } from '@components/general/Collapse';
import { Divider, Space } from '@components/layout';
import { IGNodeEditModel } from '@models';
import { IAnswerView } from '@models/interfaces/res/IGetFlowRes';
import classnames from 'classnames';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { QuicksEdit } from './QuicksEdit';

export const AnswerNodeEdit = () => {
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
      <Collapse label={'사용자 응답 받기'} useSwitch={true} field={'useUtteranceParam'}>
        <div className="m-b-8">
          <span className="subLabel">변수 설정 </span>
          <span className="required">*</span>
        </div>
        <div className={classnames('input', { 'disabled ': !use })}>
          <Input
            {...register(`view.utteranceParam`)}
            placeholder="변수명을 입력해주세요"
            disabled={!use}
          />
        </div>
      </Collapse>
      <QuicksEdit />
    </>
  );
};
