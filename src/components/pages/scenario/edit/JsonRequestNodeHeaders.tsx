import { Button, Col, Input, Row } from '@components';
import { usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { IJsonRequestView } from '@models/interfaces/res/IGetFlowRes';
import { useFieldArray, useFormContext } from 'react-hook-form';

export const JsonRequestNodeHeaders = () => {
  const { t, isReadOnly } = usePage();
  const { register, control } = useFormContext<IGNodeEditModel<IJsonRequestView>>();

  const {
    fields: headersField,
    append: headersAppend,
    remove: headersRemove,
  } = useFieldArray({
    name: `view.headers`,
    control,
  });

  const handleAddHeadersButton = () => {
    headersAppend({ key: '', value: '' });
  };

  const handleDeleteHeadersButton = (index: number) => {
    headersRemove(index);
  };

  return (
    <>
      <div className="m-b-12">
        <span className="subLabel">{t(`API_REQUEST_HEADER_INPUT_LABEL`)}</span>
      </div>
      {headersField.map((header, i) => (
        <div key={header.id}>
          <div className="m-b-12">
            <Row gap={4} align="center">
              <Col span={9}>
                <Input
                  placeholder="Key"
                  {...register(`view.headers.${i}.key`)}
                  readOnly={isReadOnly}
                  maxLength={50}
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="Value"
                  {...register(`view.headers.${i}.value`)}
                  readOnly={isReadOnly}
                  maxLength={2000}
                />
              </Col>
              <Col span={2}>
                <Button
                  shape="ghost"
                  className="icDelete"
                  onClick={() => handleDeleteHeadersButton(i)}
                />
              </Col>
            </Row>
          </div>
        </div>
      ))}

      <div className="apiFieldAddBtn m-b-12">
        <Button className="addBtn" shape="ghost" onClick={handleAddHeadersButton}>
          + Header
        </Button>
      </div>
    </>
  );
};
