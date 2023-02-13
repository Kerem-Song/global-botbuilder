import {
  Button,
  Divider,
  FormItem,
  Input,
  InputTextarea,
  Space,
  Switch,
} from '@components';
import { Collapse } from '@components/general/Collapse';
import { IGNodeEditModel } from '@models';
import { ImageAspectRatio } from '@models/enum';
import { IBasicCardView } from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageSetting } from './ImageSetting';

export const BasicCardNodeEdit = () => {
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IBasicCardView>>();
  const values = getValues();
  console.log('basic card node edit', values);

  const { fields, append, remove } = useFieldArray({
    name: `view.buttons`,
    control,
  });

  useEffect(() => {
    console.log('basic card node edit');
  }, [fields]);

  return (
    <>
      <Collapse label={'이미지 설정'} useSwitch={true} field={'imageCtrl'}>
        {values.view?.imageCtrl && (
          <ImageSetting imageRatio={imageRatio} setImageRatio={setImageRatio} />
        )}
      </Collapse>

      <Collapse label={'텍스트 설정'} useSwitch={false}>
        <Space direction="vertical">
          <span className="subLabel">타이틀</span>
          <FormItem error={errors.view && errors.view.title}>
            <Input {...register('view.title')} />
          </FormItem>
          <span className="subLabel">내용</span>
          <FormItem error={errors.view && errors.view.description}>
            <InputTextarea
              height={100}
              showCount
              maxLength={1000}
              placeholder="Input Text"
              {...register('view.description')}
            />
          </FormItem>
        </Space>
      </Collapse>

      <Collapse label={'버튼'} useSwitch={false}>
        {values.view && values.view.buttons && <ButtonsEdit />}
      </Collapse>
    </>
  );
};