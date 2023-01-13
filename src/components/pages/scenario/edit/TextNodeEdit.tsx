import { Input, InputTextarea } from '@components';
import { useFormContext } from 'react-hook-form';

export const TextNodeEdit = () => {
  const { register, getValues } = useFormContext();
  console.log(getValues());
  return (
    <>
      <div className="node-item-wrap">
        <p className="m-b-8">
          <span className="label">텍스트</span>
          <span className="required">*</span>
        </p>
        <InputTextarea
          style={{ minHeight: '100px', maxHeight: '320px' }}
          autoHeight
          showCount
          maxLength={1000}
          placeholder="Input Text"
          {...register('view.text')}
        />
      </div>
    </>
  );
};
