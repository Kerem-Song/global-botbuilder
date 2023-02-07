import { FormItem, Input } from '@components/data-entry';
import { Collapse } from '@components/general/Collapse';
import { IGNodeEditModel } from '@models';
import { IParameterSetView } from '@models/interfaces/res/IGetFlowRes';
import classnames from 'classnames';
import { useController, useFormContext } from 'react-hook-form';

export const ParameterSetNodeEdit = () => {
  const {
    register,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IParameterSetView>>();

  const values = getValues();
  console.log('value.view in ParameterSetNodeNodeEdit', values.view);
  console.log('errors in Parameter set node edit:', errors);

  return (
    <>
      <Collapse label={'파라미터 설정'} useSwitch={false}>
        <div className="m-b-8">
          <span className="subLabel">입력 받을 메시지 </span>
          <span className="required">*</span>
        </div>

        <FormItem
          error={errors.view && errors.view.parameters && errors.view.parameters[0]?.name}
        >
          <Input
            {...register(`view.parameters.${0}.name`)}
            placeholder="변수명을 입력해주세요"
          />
        </FormItem>
        <FormItem
          error={
            errors.view && errors.view.parameters && errors.view.parameters[0]?.value
          }
        >
          <Input
            {...register(`view.parameters.${0}.value`)}
            placeholder="값을 입력해주세요"
          />
        </FormItem>
      </Collapse>
    </>
  );
};
