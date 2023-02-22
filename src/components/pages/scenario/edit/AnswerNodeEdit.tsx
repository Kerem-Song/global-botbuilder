import { Collapse } from '@components/general/Collapse';
import { usePage } from '@hooks';
import { useVariableSelectClient } from '@hooks/client/variableSelectClient';
import { IGNodeEditModel, VariableKind } from '@models';
import { IAnswerView } from '@models/interfaces/res/IGetFlowRes';
import classnames from 'classnames';
import { useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';

import { QuicksEdit } from './QuicksEdit';

export interface IParameterSelect {
  readonly value?: string;
  readonly label?: string;
}

export const AnswerNodeEdit = () => {
  const { t } = usePage();

  const { setValue, control, watch } = useFormContext<IGNodeEditModel<IAnswerView>>();
  const use = watch('view.useUtteranceParam');

  const {
    getVariableSelectListQuery: { data },
  } = useVariableSelectClient();

  const parameters: IParameterSelect[] = data
    ? data
        .filter((x) => x.kind === VariableKind.Parameter)
        .map((v) => {
          return {
            label: v.name,
            value: v.name,
          };
        })
    : [];

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

  const { field } = useController({
    name: 'view.utteranceParam',
    control,
  });

  return (
    <>
      <Collapse label={t('USER_ANSWER')} useSwitch={true} field={'useUtteranceParam'}>
        <div className="m-b-8">
          <span className="subLabel">{t('VARIABLE_SETTING')} </span>
          <span className="required">*</span>
        </div>
        <div className={classnames('input', { 'disabled ': !use })}>
          <CreatableSelect
            isClearable
            placeholder={t('INPUT_VARIABLE_PLACEHOLDER')}
            isDisabled={!use}
            value={
              parameters.find((x) => x.value === field.value) || {
                label: field.value,
                value: field.value,
              }
            }
            formatOptionLabel={(value) =>
              value?.value?.replace('{{', '').replace('}}', '')
            }
            onChange={(value) => {
              field.onChange(value?.value ? `{{${value?.value}}}` : undefined);
            }}
            options={parameters}
          />
        </div>
      </Collapse>
      <QuicksEdit />
    </>
  );
};
