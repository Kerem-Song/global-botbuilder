import { FormItem, Input, InputTextarea } from '@components/data-entry';
import { Collapse } from '@components/general/Collapse';
import { Space } from '@components/layout';
import { useRootState } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES, ImageAspectRatio, INode } from '@models';
import { IBasicCardCarouselView } from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageSettings } from './ImageSettings';

export const BasicCardCarousleNodeEdit = (selectedNode: IBasicCardCarouselView) => {
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IBasicCardCarouselView>>();
  const values = getValues();
  console.log('basic card carousel node edit', values);

  const carouselIndexObj = useRootState((state) => state.botBuilderReducer.carouselIndex);
  const index = Object.values(carouselIndexObj)[0];

  const { fields, append, remove } = useFieldArray({
    name: `view.childrenViews.${index}.buttons`,
    control,
  });

  useEffect(() => {
    console.log('basic card carousel node edit');
  }, [fields]);

  return (
    <>
      <Collapse label={'이미지 설정'} useSwitch={true} field={'imageCtrl'}>
        {values.view &&
          values.view?.childrenViews &&
          values.view?.childrenViews[index]?.imageCtrl && (
            <ImageSettings
              imageRatio={imageRatio}
              setImageRatio={setImageRatio}
              index={index}
              imageCtrl={IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL}
            />
          )}
      </Collapse>

      <Collapse label={'텍스트 설정'} useSwitch={false}>
        <Space direction="vertical">
          <span className="subLabel">타이틀</span>
          <FormItem
            error={
              errors.view &&
              errors.view.childrenViews &&
              errors.view.childrenViews[index]?.title
            }
          >
            <Input {...register(`view.childrenViews.${index}.title`)} />
          </FormItem>
          <span className="subLabel">내용</span>
          <FormItem
            error={
              errors.view &&
              errors.view.childrenViews &&
              errors.view.childrenViews[index]?.description
            }
          >
            <InputTextarea
              height={100}
              showCount
              maxLength={1000}
              placeholder="Input Text"
              {...register(`view.childrenViews.${index}.description`)}
            />
          </FormItem>
        </Space>
      </Collapse>

      <Collapse label={'버튼'} useSwitch={false}>
        {values.view &&
          values.view.childrenViews &&
          values.view.childrenViews[index]?.buttons && <ButtonsEdit />}
      </Collapse>
    </>
  );
};
