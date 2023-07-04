import {
  Button,
  Col,
  Collapse,
  Divider,
  FormItem,
  Input,
  InputTextarea,
  Radio,
  Row,
} from '@components';
import {
  dataApiTestClient,
  useHistoryViewerMatch,
  useNodeEditSave,
  usePage,
} from '@hooks';
import { IGNodeEditModel } from '@models';
import { IJsonRequestView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';
import ReactLoading from 'react-loading';

import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';
import { InputWithTitleCounter } from './InputWithTitleCounter';
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
    resetField,
    reset,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IJsonRequestView>>();
  console.log('@json req view', getValues().view);
  const [loading, setLoading] = useState<boolean>(false);
  const isHistoryViewer = useHistoryViewerMatch();
  const values = getValues().view!;

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

  const { checkDataApiTest } = dataApiTestClient();
  const {
    data: res,
    error,
    isError,
    isFetching,
    refetch,
    isRefetching,
  } = checkDataApiTest(values);

  const handleApiValidation = () => {
    setLoading(true);
    refetch()
      .then((res) => {
        resetField('view.apiRes');
        setValue('view.apiRes', JSON.stringify(res?.data, null, 2), {
          shouldDirty: true,
        });

        if (res.isError) {
          resetField('view.apiRes');

          setValue('view.apiRes', JSON.stringify(res.error, null, 2), {
            shouldDirty: true,
          });
        }

        setLoading(false);
      })
      .catch((error) => {
        resetField('view.apiRes');
        setValue('view.apiRes', JSON.stringify(error, null, 2), { shouldDirty: true });
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log('@watch view id', watch('view.id'));
    resetField('view.apiRes', { keepDirty: false });
    resetField('view.responseMapping', { keepDirty: false });
    resetField('nextNodeId', { keepDirty: false });
  }, [watch('view.id')]);

  return (
    <>
      <Collapse label={t(`API_REQUEST_BASIC_SETTING`)} useSwitch={false}>
        <p className="m-b-8">
          Method <span className="required">*</span>
        </p>
        <FormItem error={errors.view?.method}>
          <Row justify="space-between" className="m-b-8">
            <Col span={12} className="radioContainer">
              <Radio
                checked={watch('view.method') === 'POST'}
                onChange={method.onChange}
                ref={method.ref}
                value={'POST'}
              >
                <span>POST</span>
              </Radio>
            </Col>
            <Col span={12} className="radioContainer">
              <Radio
                checked={watch('view.method') === 'GET'}
                onChange={method.onChange}
                ref={method.ref}
                value={'GET'}
              >
                <span>GET</span>
              </Radio>
            </Col>
          </Row>
        </FormItem>
        <FormItem error={errors.view?.url}>
          <InputWithTitleCounter
            label={t(`API_REQUEST_URL_LABEL`)}
            placeholder={t(`API_REQUEST_URL_PLACEHOLDER`)}
            required={true}
            {...register('view.url')}
            readOnly={isHistoryViewer}
          />
        </FormItem>
        <Divider style={{ margin: '28px 0' }} />
        <div className="m-b-8">
          <span className="subLabel">{t(`API_REQUEST_HEADER_INPUT_LABEL`)}</span>
        </div>
        {headersField.map((header, i) => (
          <div key={header.id}>
            <div className="m-b-8">
              <Row gap={4} align="center">
                <Col span={9}>
                  <Input
                    placeholder="Key"
                    {...register(`view.headers.${i}.key`)}
                    readOnly={isHistoryViewer}
                  />
                </Col>
                <Col span={12}>
                  <Input
                    placeholder="Value"
                    {...register(`view.headers.${i}.value`)}
                    readOnly={isHistoryViewer}
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
        <div className="apiFieldAddBtn m-b-8">
          <Button className="addBtn" shape="ghost" onClick={handleAddHeadersButton}>
            + Header
          </Button>
        </div>
        <Divider style={{ margin: '28px 0' }} />
        <div className="m-b-8">
          <span className="subLabel">{t(`API_REQUEST_QUERY_STRING_INPUT_LABEL`)}</span>
        </div>
        {queryStringField.map((queryString, i) => (
          <div key={queryString.id}>
            <div className="m-b-8">
              <Row gap={4} align="center">
                <Col span={9}>
                  <Input
                    placeholder="Key"
                    {...register(`view.queryStrings.${i}.key`)}
                    readOnly={isHistoryViewer}
                  />
                </Col>
                <Col span={12}>
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
        <Divider style={{ margin: '28px 0' }} />
        <FormItem>
          <InputTextAreaWithTitleCounter
            className="textNodeTextArea"
            maxRows={6}
            minRows={6}
            label={t(`API_REQUEST_JSON_BODY_LABEL`)}
            placeholder={t(`API_REQUEST_JSON_BODY_PLACEHOLDER`)}
            {...register('view.body')}
            readOnly={isHistoryViewer}
          />
        </FormItem>
        <Divider style={{ margin: '28px 0' }} />
        <Row align="center" className="apiValidationHeader">
          <Col span={21}>{t(`API_REQUEST_VALIDATION`)}</Col>
          <Col span={2}>
            <Button
              small
              type="primary"
              onClick={handleApiValidation}
              disabled={isFetching || isRefetching}
            >
              {t(`API_REQUEST_VALIDATION_START`)}
            </Button>
          </Col>
        </Row>

        <div className="apiResWrapper" data-loading={loading}>
          {loading && (
            <ReactLoading
              type="spin"
              color="#4478FF"
              height={50}
              width={50}
              className="apiResLoading"
            />
          )}
          <InputTextarea
            minRows={6}
            maxRows={6}
            placeholder={t(`API_REQUEST_VALIDATION_PLACEHOLDER`)}
            {...register(`view.apiRes`)}
            readOnly={true}
            className={classNames('textNodeTextArea', { jsonResOverlay: loading })}
          />
        </div>
      </Collapse>
      <Collapse label={'Response Mapping'} useSwitch={false}>
        {resMappingField.map((res, i) => (
          <div key={res.id}>
            <div className="m-b-4">
              <span className="subLabel">Json Path</span>
            </div>
            <FormItem error={errors.view?.responseMapping?.[i]?.key}>
              <InputTextAreaWithTitleCounter
                placeholder={t(
                  `API_REQUEST_RESPONSE_MAPPING_JSON_PATH_INPUT_PLACEHOLDER`,
                )}
                {...register(`view.responseMapping.${i}.key`)}
                readOnly={isHistoryViewer}
                className="m-b-12"
              />
            </FormItem>
            <div className="m-b-8">
              <p className="subLabel m-b-12">Set to</p>
              <p className="subLabel">variable</p>
            </div>
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
