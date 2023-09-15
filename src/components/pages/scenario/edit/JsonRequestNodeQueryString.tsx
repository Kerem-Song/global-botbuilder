import { Button, Col, Input, Row } from '@components';
import { usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { IJsonRequestView } from '@models/interfaces/res/IGetFlowRes';
import { useFieldArray, useFormContext } from 'react-hook-form';

export const JsonRequestNodeQueryString = () => {
  const { t, isReadOnly } = usePage();
  const { register, control } = useFormContext<IGNodeEditModel<IJsonRequestView>>();

  const {
    fields: queryStringField,
    append: queryStringAppend,
    remove: queryStringRemove,
  } = useFieldArray({
    name: `view.queryStrings`,
    control,
  });

  const handleAddQueryStringsButton = () => {
    queryStringAppend({ key: '', value: '' });
  };

  const handleDeleteQueryStringsButton = (index: number) => {
    queryStringRemove(index);
  };

  return (
    <>
      {' '}
      <div className="m-b-12">
        <span className="subLabel">{t(`API_REQUEST_QUERY_STRING_INPUT_LABEL`)}</span>
      </div>
      {queryStringField.map((queryString, i) => (
        <div key={queryString.id}>
          <div className="m-b-12">
            <Row gap={4} align="center">
              <Col span={9}>
                <Input
                  placeholder="Key"
                  {...register(`view.queryStrings.${i}.key`)}
                  readOnly={isReadOnly}
                  maxLength={50}
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="Value"
                  {...register(`view.queryStrings.${i}.value`)}
                  readOnly={isReadOnly}
                  maxLength={2000}
                />
              </Col>
              <Col span={2}>
                <Button
                  shape="ghost"
                  className="icDelete"
                  onClick={() => handleDeleteQueryStringsButton(i)}
                />
              </Col>
            </Row>
          </div>
        </div>
      ))}
      <div className="apiFieldAddBtn m-b-12">
        <Button className="addBtn" shape="ghost" onClick={handleAddQueryStringsButton}>
          + Query String{' '}
        </Button>
      </div>
    </>
  );
};
