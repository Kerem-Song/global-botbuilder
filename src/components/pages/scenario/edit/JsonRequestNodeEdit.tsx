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
  Space,
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
import { useState } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';
import ReactLoading from 'react-loading';

import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';
import { InputWithTitleCounter } from './InputWithTitleCounter';
import { JsonRequestNodeHeaders } from './JsonRequestNodeHeaders';
import { JsonRequestNodeQueryString } from './JsonRequestNodeQueryString';
import { JsonRequestNodeResponseMapping } from './JsonRequestNodeResponseMapping';
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
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IJsonRequestView>>();

  const [loading, setLoading] = useState<boolean>(false);
  const values = getValues();
  const isHistoryViewer = useHistoryViewerMatch();
  const view = getValues().view!;

  const { field: method } = useController({ name: 'view.method', control });

  const { checkDataApiTest } = dataApiTestClient();
  const { data: res, isFetching, refetch, isRefetching } = checkDataApiTest(view);

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

  return (
    <div key={values.id}>
      <Collapse label={t(`API_REQUEST_BASIC_SETTING`)} useSwitch={false}>
        <p className="m-b-12">
          Method <span className="required">*</span>
        </p>
        <FormItem error={errors.view?.method}>
          <Row justify="space-between" className="m-b-12">
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
            maxLength={2000}
          />
        </FormItem>
        <Divider style={{ margin: '32px 0' }} />

        <JsonRequestNodeHeaders />

        <Divider style={{ margin: '32px 0' }} />

        <JsonRequestNodeQueryString />

        <Divider style={{ margin: '32px 0' }} />
        <FormItem>
          <InputTextAreaWithTitleCounter
            className="textNodeTextArea"
            maxRows={6}
            minRows={6}
            label={t(`API_REQUEST_JSON_BODY_LABEL`)}
            placeholder={t(`API_REQUEST_JSON_BODY_PLACEHOLDER`)}
            {...register('view.body')}
            readOnly={isHistoryViewer}
            maxLength={20000}
          />
        </FormItem>
        <Divider style={{ margin: '32px 0' }} />
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

      <JsonRequestNodeResponseMapping />

      <Collapse label={t(`API_REQUEST_MESSAGE_CONNECT_SETTING`)} useSwitch={false}>
        <>
          <div className="m-b-12">
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
    </div>
  );
};
