import { icImg } from '@assets';
import { Col, Input, InputTextarea, Radio, Row, Space, Switch, Title } from '@components';
import { IButtonType } from '@models';
import { useFormContext } from 'react-hook-form';

export const BasicCardNodeEdit = () => {
  const { register, getValues } = useFormContext();
  const values = getValues();
  console.log(values);
  return (
    <>
      <div className="node-item-wrap">
        <p className="m-b-8">
          <Space style={{ alignItems: 'center' }}>
            <span className="label">이미지 설정</span>
            <Switch />
          </Space>
        </p>
        <Space direction="vertical">
          <span className="subLabel">이미지 업로드</span>
          <span className="subLabel">이미지 타입</span>
          <Row>
            <Col span={12}>
              <Radio>
                <span>직사각형</span>
              </Radio>
            </Col>
            <Col span={12}>
              <Radio>
                <span>정사각형</span>
              </Radio>
            </Col>
          </Row>
          <div
            style={{
              height: '118px',
              border: '1px dashed #DCDCDC',
              background: '#FFFFFF',
              borderRadius: '8px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                textAlign: 'center',
                width: '200px',
                bottom: '50%',
                right: '50%',
                transform: 'translate(50%, 50%)',
              }}
            >
              <img src={icImg} alt="icImg" />
              <br />
              Recommended
              <br />
              Rectangular: 800x400
            </div>
          </div>
        </Space>
      </div>
      <div className="node-item-wrap">
        <p className="m-b-8">
          <span className="label">텍스트 설정</span>
          <span className="required">*</span>
        </p>
        <Space direction="vertical">
          <span className="subLabel">타이틀</span>
          <Input {...register('view.title')} />
          <span className="subLabel">내용</span>
          <InputTextarea
            height={100}
            showCount
            maxLength={1000}
            placeholder="Input Text"
            {...register('view.description')}
          />
        </Space>
      </div>
      {values.view &&
        values.view.buttons &&
        values.view.buttons.map((b: IButtonType, index: number) => {
          return (
            <div className="node-item-wrap" key={b.id}>
              <p className="m-b-8">
                <span className="label">버튼</span>
                <span className="required">*</span>
              </p>
              <Space direction="vertical">
                <span className="subLabel">버튼명</span>
                <Input {...register(`view.buttons[${index}].label`)} />
                <span className="subLabel">버튼타입</span>
              </Space>
            </div>
          );
        })}
    </>
  );
};
