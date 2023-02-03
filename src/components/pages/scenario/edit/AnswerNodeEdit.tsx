import { Input, Switch } from '@components';
import { Divider, Space } from '@components/layout';
import { IGNodeEditModel } from '@models';
import { IAnswerView } from '@models/interfaces/res/IGetFlowRes';
import classnames from 'classnames';
import { useFormContext } from 'react-hook-form';

import { QuicksEdit } from './QuicksEdit';

export const AnswerNodeEdit = () => {
  const {
    register,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IAnswerView>>();
  const values = getValues();
  console.log('value.view', values.view);

  return (
    <>
      <div className="node-item-wrap">
        <div className="m-b-8">
          <Space direction="vertical">
            <Space direction="horizontal" style={{ alignItems: 'center' }}>
              <span className="label">사용자 응답 받기</span>
              <Switch />
            </Space>
            <Divider />
            <div>
              <span>변수 설정</span>
              <span className="required">*</span>
            </div>
            <div
              className={classnames('input', {
                // 'disabled ': !values.view?.useUtteranceParam,
              })}
            >
              <Input
                {...register(`view.utteranceParam`)}
                placeholder="변수명을 입력해주세요"
                // disabled={!values.view?.useUtteranceParam}
              />
            </div>
          </Space>
        </div>
      </div>
      <QuicksEdit />
    </>
  );
};
