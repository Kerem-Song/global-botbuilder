import { icPopupClose, icPrev, icUtteranceEmpty } from '@assets';
import {
  Button,
  Card,
  Col,
  FormItem,
  Input,
  Radio,
  Row,
  Space,
  Title,
} from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEntityClient, useRootState } from '@hooks';
import { ISaveEntryGroup } from '@models';
import React, { Dispatch, FC, useEffect, useRef, useState } from 'react';
import { FormProvider, useController, useFieldArray, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';

import { EntityDetailItem } from './EntityDetailItem';

export interface EntityDetailProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
  value?: string;
  onChange?: Dispatch<React.SetStateAction<string>>;
  entryId?: string;
  setEntryId: (value: string) => void;
  selectedOption?: string;
}

export const EntityDetailPopup: FC<EntityDetailProps> = ({
  isOpen,
  handleIsOpen,
  entryId,
  setEntryId,
}) => {
  const [entryInputError, setEntryInputError] = useState<string>();
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const { entryGroupMutate, getEntryDetailQuery } = useEntityClient();
  const token = useRootState((state) => state.botInfoReducer.token);
  const entryDetails = getEntryDetailQuery(entryId);

  useEffect(() => {
    if (entryDetails && entryDetails.data) {
      const resetValue = {
        entryGroupid: entryDetails.data.id,
        name: entryDetails.data.name,
        entryGroupType: entryDetails.data.entryGroupType,
        isRegex: entryDetails.data.entryGroupType === 2,
        usingName: entryDetails.data.usingName,
        entryStr: entryDetails.data.entryStr,
        entries: entryDetails.data.entries,
      };
      reset(resetValue);
    }
  }, [entryDetails?.data]);

  const defaultValues: ISaveEntryGroup = {
    name: '',
    isRegex: false,
    entries: [],
  };

  const schema = yup.object({
    representativeEntry: yup
      .string()

      .trim()

      .when('isRegex', {
        is: false,
        then: yup
          .string()
          .trim()
          .matches(
            /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣a-zA-Z0-9][^!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]*$/,
            `특수문자, 이모지는 입력할 수 없습니다.`,
          )
          .required(),
      })
      .required(),
  });

  const entityNameSchema = yup
    .object({
      name: yup
        .string()
        .required('엔티티 명은 필수입니다.')
        .matches(
          /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣a-zA-Z0-9][^!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]*$/,
          `특수문자, 이모지는 입력할 수 없습니다.`,
        )
        .max(20, `20자를 초과할 수 없습니다.`),
      entries: yup.array().of(schema),
    })
    .required();

  const formMethods = useForm<ISaveEntryGroup>({
    defaultValues,
    resolver: yupResolver(entityNameSchema),
  });

  const {
    reset,
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = formMethods;

  const { fields, append, remove } = useFieldArray({ control, name: 'entries' });

  const { field: isRegexField } = useController({ name: 'isRegex', control });

  const entryGroupName = useRef<HTMLInputElement>(null);

  const isEntryInputError = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regExp1 = /[~!@#$%";'^,&*()_+|</>=>`?:{[}]/g;
    const regExp2 =
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;

    if (regExp1.test(e.target.value) || regExp2.test(e.target.value)) {
      setEntryInputError('특수문자, 이모지는 입력할 수 없습니다.');
    } else {
      setEntryInputError('');
    }
  };

  const handleSave = async (entryData: ISaveEntryGroup): Promise<void> => {
    if (entryData.entryGroupid) {
      const modifyEntry: ISaveEntryGroup = {
        sessionToken: token,
        name: entryData.name,
        isRegex: entryData.isRegex,
        entries: entryData.entries,
        entryGroupid: entryData.entryGroupid,
      };

      const res = await entryGroupMutate.mutateAsync(modifyEntry);

      if (res) {
        console.log('modifyEntry', res);
        reset();
        handleIsOpen(false);
      }
    } else {
      const newEntry: ISaveEntryGroup = {
        sessionToken: token,
        name: entryData.name,
        isRegex: entryData.isRegex,
        entries: entryData.entries,
      };

      const res = await entryGroupMutate.mutateAsync(newEntry);

      if (res) {
        console.log('newEntry', res);
        reset();
        handleIsOpen(false);
      }
    }
  };

  const handleRegisterEntry = (name?: string): void => {
    if (!name) {
      return;
    }

    if (entryInputError) {
      return;
    }

    append({ representativeEntry: name });

    if (entryGroupName.current) {
      entryGroupName.current.value = '';
    }
  };

  const handleClose = () => {
    reset();
    remove();
    setEntryId('');
    handleIsOpen(false);
  };

  return (
    <ReactModal className="entityModal detail" isOpen={isOpen}>
      <div className="detail header">
        <div className="listBtn">
          <Button
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onClick={handleClose}
          >
            <img src={icPrev} alt="prev"></img>
            List
          </Button>
        </div>
        <button className="closeBtn" onClick={handleClose}>
          <img src={icPopupClose} alt="delete"></img>
        </button>
      </div>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(handleSave)}>
          <div className="entitiesContainer">
            <div className="entitiesWrapper">
              <div className="entityDetailHeader">
                <Title level={2}>Entity</Title>
                <Button type="primary" large htmlType="submit">
                  Save
                </Button>
              </div>
              <Card
                radius="normal"
                bodyStyle={{ padding: '20px' }}
                style={{ border: '1px solid #DCDCDC', marginTop: '20px' }}
              >
                <Space direction="vertical">
                  <Row align="center" gap={10} style={{ marginBottom: '20px' }}>
                    <Col style={{ width: '140px' }}>
                      <span>Entity Name</span>
                      <span style={{ color: 'red' }}> *</span>
                    </Col>
                    <Col flex="auto">
                      <FormItem error={errors.name}>
                        <Input
                          {...register('name')}
                          placeholder="Input Intent Name"
                          showCount
                          maxLength={20}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row align="center" gap={10} style={{ marginBottom: '20px' }}>
                    <Col style={{ width: '140px' }}>
                      <span>Entry type</span>
                      <span style={{ color: 'red' }}> *</span>
                    </Col>
                    <Col style={{ display: 'flex' }}>
                      {entryDetails?.data?.id ? (
                        <>
                          {entryDetails?.data?.entryGroupType === 0 ? 'String' : 'Regax'}
                        </>
                      ) : (
                        <>
                          <Radio
                            checked={isRegexField.value === false}
                            onChange={() => isRegexField.onChange(false)}
                            ref={isRegexField.ref}
                          >
                            String
                          </Radio>
                          <Radio
                            style={{ marginLeft: '40px' }}
                            checked={isRegexField.value === true}
                            onChange={() => isRegexField.onChange(true)}
                            ref={isRegexField.ref}
                          >
                            Regex
                          </Radio>
                        </>
                      )}
                    </Col>
                  </Row>
                  <Row align="center" gap={10}>
                    {watch('isRegex') === true ||
                    entryDetails?.data?.entryGroupType === 2 ? (
                      <>
                        <Col style={{ width: '140px' }}>
                          <span>Regular expression</span>
                          <span style={{ color: 'red' }}> *</span>
                        </Col>
                        <Col flex="auto">
                          <FormItem error={errors.entries?.[0]?.representativeEntry}>
                            <Input
                              {...register('entries.0.representativeEntry')}
                              placeholder="Input entity name"
                            />
                          </FormItem>
                        </Col>
                      </>
                    ) : (
                      <></>
                    )}
                  </Row>
                </Space>
              </Card>
              {watch('isRegex') === false || entryDetails?.data?.entryGroupType === 0 ? (
                <div className="searchInput">
                  <Input
                    size="small"
                    search
                    placeholder="Input search word"
                    onBlur={(e) => setSearchKeyword(e.target.value)}
                    onPressEnter={(value) => setSearchKeyword(value!)}
                  ></Input>
                </div>
              ) : null}
              <div className="registerEntry">
                {watch('isRegex') === false ||
                entryDetails?.data?.entryGroupType === 0 ? (
                  <Card
                    radius="normal"
                    bodyStyle={{ padding: '20px' }}
                    style={{ border: '1px solid #DCDCDC', marginTop: '20px' }}
                  >
                    <Space direction="vertical">
                      <Row>
                        <Col flex="auto" style={{ display: 'flex' }}>
                          <Input
                            placeholder="Input Representative entry."
                            size="normal"
                            ref={entryGroupName}
                            onPressEnter={handleRegisterEntry}
                            onChange={isEntryInputError}
                            onBlur={isEntryInputError}
                            isError={entryInputError ? true : false}
                          ></Input>
                          <Button
                            style={{ marginLeft: '8px' }}
                            type="primary"
                            onClick={() =>
                              handleRegisterEntry(entryGroupName.current?.value)
                            }
                          >
                            Register
                          </Button>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          marginBottom: '10px',
                        }}
                      >
                        <span className="error-message">{entryInputError}</span>
                      </Row>
                    </Space>
                    <Row gap={8}>
                      <>
                        {watch('entries').length === 0 ? (
                          <Row
                            style={{
                              width: '100%',
                              marginTop: '12px',
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            <div className="emptyList">
                              <div className="empty">
                                <img src={icUtteranceEmpty} alt="empty" />
                                <span>No entries registered</span>
                              </div>
                            </div>
                          </Row>
                        ) : watch('isRegex') === false ||
                          entryDetails?.data?.entryGroupType === 0 ? (
                          <>
                            {fields.map((entryGroup, i) => {
                              return (
                                <EntityDetailItem
                                  key={i}
                                  index={i}
                                  entriesRemove={remove}
                                  searchKeyword={searchKeyword}
                                />
                              );
                            })}
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    </Row>
                  </Card>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </ReactModal>
  );
};
