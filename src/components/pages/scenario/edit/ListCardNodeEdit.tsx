import { icImg } from '@assets';
import {
  Button,
  Col,
  Divider,
  Input,
  InputTextarea,
  Radio,
  Row,
  Space,
  Switch,
  Title,
} from '@components';
import { IButtonType, ISortableListItem } from '@models';
import { useFormContext } from 'react-hook-form';

export const ListCardNodeEdit = () => {
  const { register, getValues } = useFormContext();
  const values = getValues();
  console.log('value.view', values.view);
  return (
    <>
      <div className="node-item-wrap">
        <p className="m-b-8">
          <Space direction="vertical">
            <span className="label">Head Title</span>
            <Input {...register('view.header.title')} />
          </Space>
        </p>
      </div>
      <div className="node-item-wrap">
        <p className="m-b-8">
          <Space style={{ alignItems: 'center' }}>
            <span className="label">Head 이미지 설정</span>
            <Switch />
          </Space>
        </p>
        <Space direction="vertical">
          <p className="m-b-8">
            <span className="subLabel">이미지 업로드 </span>
            <span className="required">*</span>
          </p>

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
              Rectangular: 800 x 400
            </div>
          </div>
        </Space>
      </div>
      <div className="node-item-wrap">
        <Space style={{ alignItems: 'center' }}>
          <span className="label">List</span>
        </Space>
        <Divider />
        {values.view &&
          values.view.items &&
          values.view.items.map((item: ISortableListItem, index: number) => (
            <div key={item.id}>
              <p className="m-b-8">
                <span className="subLabel">List 이미지 업로드 </span>
                <span className="required">*</span>
              </p>
              <p className="m-b-8">
                <Space direction="vertical">
                  <Row align="center" gap={12} style={{ margin: 0 }}>
                    <Col span={8} className="img"></Col>
                    <Col span={14}>
                      <p>Recommended</p>
                      <p>400 x 400 </p>
                    </Col>
                  </Row>
                </Space>
              </p>
              <p className="m-b-8">
                <Space direction="vertical">
                  <span className="label">List Title</span>
                  <Input {...register(`view.items[${index}].title`)} />
                </Space>
              </p>
              <p className="m-b-8">
                <Space direction="vertical">
                  <span className="label">List Contents</span>
                  <Input {...register(`view.items[${index}].description`)} />
                </Space>
              </p>
            </div>
          ))}
        <p>
          <Button shape="ghost" className="addBtn">
            + Add a List
          </Button>
        </p>
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
