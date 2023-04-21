import { Button, Col, Divider, Row } from '@components';
import { FormItem, Input, Radio } from '@components/data-entry';
import { Collapse } from '@components/general/Collapse';
import { useHistoryViewerMatch, usePage } from '@hooks';
import { useNodeEditSave } from '@hooks/useNodeEditSave';
import { IGNodeEditModel } from '@models';
import { IJsonRequestView } from '@models/interfaces/res/IGetFlowRes';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';
import { ParameterSelector } from './ParameterSelector';
import { SelectNode } from './SelectNode';

export const JsonRequestNodeEdit = () => {
  useNodeEditSave();

  const { t } = usePage();

  const {
    register,
    watch,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IJsonRequestView>>();
  console.log('@json req view', getValues().view);
  const isHistoryViewer = useHistoryViewerMatch();

  const { field: method } = useController({ name: 'view.method', control });

  const {
    fields: headersField,
    append: headersAppend,
    remove: headersRemove,
  } = useFieldArray({
    name: `view.headers`,
    control,
  });

  const {
    fields: queryStringField,
    append: queryStringAppend,
    remove: queryStringRemove,
  } = useFieldArray({
    name: `view.queryStrings`,
    control,
  });

  const {
    fields: resMappingField,
    append: resMappingAppend,
    remove: resMappingRemove,
  } = useFieldArray({
    name: `view.responseMapping`,
    control,
  });

  const handleAddHeadersButton = () => {
    headersAppend({ key: '', value: '' });
  };

  const handleDeleteHeadersButton = (index: number) => {
    headersRemove(index);
  };

  const handleAddQueryStringsButton = () => {
    queryStringAppend({ key: '', value: '' });
  };

  const handleDeleteQueryStringsButton = (index: number) => {
    queryStringRemove(index);
  };

  const handleAddResMappingButton = () => {
    resMappingAppend({ key: '', value: '' });
  };

  const handleDeleteResMappingButton = (index: number) => {
    resMappingRemove(index);
  };

  return (
    <>
      <Collapse label={t(`API_REQUEST_BASIC_SETTING`)} useSwitch={false}>
        <p className="m-b-8">Method</p>
        <FormItem error={errors.view?.method}>
          <Row justify="space-between" className="m-b-8">
            <Col span={12} className="radioContainer">
              <Radio
                checked={watch('view.method') === 'POST'}
                onChange={() => setValue(`view.method`, 'POST')}
                ref={method.ref}
              >
                <span>POST</span>
              </Radio>
            </Col>
            <Col span={12} className="radioContainer">
              <Radio
                checked={watch('view.method') === 'GET'}
                onChange={() => setValue(`view.method`, 'GET')}
                ref={method.ref}
              >
                <span>GET</span>
              </Radio>
            </Col>
          </Row>
        </FormItem>
        <FormItem error={errors.view?.url}>
          <InputTextAreaWithTitleCounter
            label={t(`API_REQUEST_URL_LABEL`)}
            placeholder={t(`API_REQUEST_URL_PLACEHOLDER`)}
            {...register('view.url')}
          />
        </FormItem>
        <Divider />
        {headersField.map((header, i) => (
          <div key={header.id}>
            <div className="m-b-8">
              <span className="subLabel">{t(`API_REQUEST_HEADER_INPUT_LABEL`)}</span>
            </div>
            <div className="m-b-8">
              <Row gap={2} align="center">
                <Col span={8}>
                  <Input placeholder="Key" {...register(`view.headers.${i}.key`)} />
                </Col>
                <Col span={14}>
                  <Input placeholder="Value" {...register(`view.headers.${i}.value`)} />
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
        <div className="apiFieldAddBtn m-b-8">
          <Button className="addBtn" shape="ghost" onClick={handleAddHeadersButton}>
            + Header
          </Button>
        </div>
        <Divider />
        {queryStringField.map((queryString, i) => (
          <div key={queryString.id}>
            <div className="m-b-8">
              <span className="subLabel">
                {t(`API_REQUEST_QUERY_STRING_INPUT_LABEL`)}
              </span>
            </div>
            <div className="m-b-8">
              <Row gap={2} align="center">
                <Col span={8}>
                  <Input
                    placeholder="Key"
                    {...register(`view.queryStrings.${i}.key`)}
                    readOnly={isHistoryViewer}
                  />
                </Col>
                <Col span={14}>
                  <Input
                    placeholder="Value"
                    {...register(`view.queryStrings.${i}.value`)}
                    readOnly={isHistoryViewer}
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
        <div className="apiFieldAddBtn m-b-8">
          <Button className="addBtn" shape="ghost" onClick={handleAddQueryStringsButton}>
            + Query String{' '}
          </Button>
        </div>
        <Divider />
        <FormItem>
          <InputTextAreaWithTitleCounter
            className="textNodeTextArea"
            maxRows={17}
            label={t(`API_REQUEST_JSON_BODY_LABEL`)}
            placeholder={t(`API_REQUEST_JSON_BODY_PLACEHOLDER`)}
            {...register('view.body')}
            readOnly={isHistoryViewer}
          />
        </FormItem>
        <Divider />
        <Row align="center">
          <Col span={21}>{t(`API_REQUEST_VALIDATION`)}</Col>
          <Col span={2}>
            <Button small type="primary">
              {t(`API_REQUEST_VALIDATION_START`)}
            </Button>
          </Col>
        </Row>
        <InputTextAreaWithTitleCounter
          className="textNodeTextArea"
          maxRows={17}
          placeholder={t(`API_REQUEST_VALIDATION_PLACEHOLDER`)}
          readOnly={isHistoryViewer}
        />
      </Collapse>
      <Collapse label={'Response Mapping'} useSwitch={false}>
        {resMappingField.map((res, i) => (
          <div key={res.id}>
            <FormItem error={errors.view?.responseMapping?.[i]?.key}>
              <InputTextAreaWithTitleCounter
                placeholder={t(
                  `API_REQUEST_RESPONSE_MAPPING_JSON_PATH_INPUT_PLACEHOLDER`,
                )}
                readOnly={isHistoryViewer}
              />
            </FormItem>
            <FormItem error={errors.view?.responseMapping?.[i]?.value}>
              <ParameterSelector
                control={control}
                path={`view.responseMapping.${i}.value`}
                placeholder={t('PARAMETER_SET_VARIABLE_PLACEHOLDER')}
                readOnly={isHistoryViewer}
              />
            </FormItem>
            <div className="deleteBtn">
              <Button shape="ghost" onClick={() => handleDeleteResMappingButton(i)}>
                {t(`API_REQUEST_RESPONSE_MAPPING_DELETE`)}
              </Button>
            </div>
          </div>
        ))}

        <div className="apiFieldAddBtn m-b-8">
          <Button className="addBtn" shape="ghost" onClick={handleAddResMappingButton}>
            + {t(`API_REQUEST_RESPONSE_MAPPING_ADD`)}
          </Button>
        </div>
      </Collapse>
      <Collapse label={t(`API_REQUEST_MESSAGE_CONNECT_SETTING`)} useSwitch={false}>
        <>
          <div className="m-b-8">
            <span className="subLabel">{t(`SET_CONNECT_NEXT_NODE`)} </span>
          </div>
          <FormItem error={errors.nextNodeId}>
            <SelectNode
              fieldName={'nextNodeId'}
              nodeId={getValues().id}
              error={errors.nextNodeId}
            />
          </FormItem>
        </>
      </Collapse>
    </>
  );
};
