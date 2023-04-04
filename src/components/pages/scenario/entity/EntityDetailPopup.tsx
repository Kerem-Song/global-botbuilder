import { icNoResult, icPopupClose, icPrev } from '@assets';
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
import { useEntityClient, useRootState, useSystemModal } from '@hooks';
import { ISaveEntryGroup } from '@models';
import { EMOJI_REGEX, SPECIAL_CHARACTOR_REGEX } from '@modules';
import { lunaToast } from '@modules/lunaToast';
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
  const [entryNameInputError, setEntryNameInputError] = useState<string>('');
  const [regexInputError, setRegexInputError] = useState<string>('');
  const [synonym, setSynonym] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const { entryGroupMutate, getEntryDetailQuery } = useEntityClient();
  const { confirm } = useSystemModal();
  const [isActive, setIsActive] = useState<boolean>(false);

  const token = useRootState((state) => state.botInfoReducer.token);
  const entryDetails = getEntryDetailQuery(entryId);

  const defaultValues: ISaveEntryGroup = {
    name: '',
    isRegex: false,
    entries: [],
  };

  const schema = yup.object({
    representativeEntry: yup
      .string()
      .required('필수 입력 항목입니다.')
      .max(125, `125자를 초과할 수 없습니다.`),
  });

  const regexSchema = yup.object({
    representativeEntry: yup.string().trim().min(1, '필수 입력 항목입니다.'),
  });

  const entityNameSchema = yup
    .object({
      name: yup
        .string()
        .trim()
        .required('필수 입력 항목입니다.')
        .test('emoji', '특수문자는 - _만 입력 가능합니다', (value) => {
          if (!value) {
            return false;
          }

          if (EMOJI_REGEX.test(value)) {
            return false;
          }

          if (SPECIAL_CHARACTOR_REGEX.test(value)) {
            return false;
          }
          return true;
        })
        .max(20, `20자를 초과할 수 없습니다.`),
      entries: yup
        .array()
        .min(1, '대표 엔트리는 최소 한 개 이상 등록되어야 합니다.')
        .when('isRegex', { is: false, then: yup.array().of(schema) })
        .when('isRegex', { is: true, then: yup.array().of(regexSchema) }),
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
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = formMethods;

  const { fields, prepend, remove } = useFieldArray({ control, name: 'entries' });

  const { field: isRegexField } = useController({ name: 'isRegex', control });
  const { field: nameField } = useController({ name: 'name', control });

  const { field } = useController({ name: 'entries', control });

  const preventGoBack = async () => {
    const result = await confirm({
      title: '저장하기',
      description: (
        <span>
          변경사항이 저장되지 않았습니다.
          <br />
          정말 나가시겠습니까?
        </span>
      ),
    });
    if (result) {
      history.go(-1);
    } else {
      history.pushState(null, '', location.href);
    }
  };

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

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'isRegex' && type === 'change') {
        setValue('entries', []);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  useEffect(() => {
    if (isActive === true) {
      (() => {
        history.pushState(null, '', location.href);
        window.addEventListener('popstate', preventGoBack);
      })();

      return () => {
        window.removeEventListener('popstate', preventGoBack);
      };
    }
  }, [isActive]);

  const handleEntityName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.indexOf(' ') > -1) {
      e.target.value = e.target.value.replaceAll(' ', '');
    }
    nameField.onChange(e);
    setIsActive(true);
    setEntryNameInputError('');
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

      console.log('modifyEntry', modifyEntry);

      entryGroupMutate.mutate(modifyEntry, {
        onSuccess: (res) => {
          if (res && res.isSuccess) {
            reset();
            lunaToast.success('수정되었습니다.');
            handleIsOpen(false);
          } else {
            setRegexInputError('필수 입력 항목입니다.');
          }
        },
        // onError: (res) => {
        //   if (res instanceof AxiosError) {
        //     setEntryNameInputError('중복된 대표 엔트리가 있습니다.');
        //   } else if (res instanceof Error) {
        //     if (res.message === 'InvalidateDataException') {
        //       console.error('에러 발생인데 InvalidateDataException임', res);
        //     } else {
        //       console.error('에러 발생', res);
        //     }
        //   }
        // },
      });
    } else {
      const newEntry: ISaveEntryGroup = {
        sessionToken: token,
        name: entryData.name,
        isRegex: entryData.isRegex,
        entries: entryData.entries,
      };
      console.log('newEntry', newEntry);

      entryGroupMutate.mutate(newEntry, {
        onSuccess: (res) => {
          if (res && res.isSuccess) {
            reset();
            lunaToast.success('저장되었습니다.');
            handleIsOpen(false);
          } else if (res?.exception.errorCode === 7608) {
            setEntryNameInputError('중복된 엔트리명 입니다.');
          } else if (entryData.isRegex === true && res?.exception.errorCode === 7000) {
            setRegexInputError('필수 입력 항목입니다.');
          }
        },
      });
    }
  };

  const handleRegisterEntry = (): void => {
    const name = synonym.trim();
    trigger('entries');
    if (!name) {
      return;
    }

    prepend({ representativeEntry: name, synonym: [] });

    setIsActive(true);
    setSynonym('');
  };

  const handleClose = async () => {
    if (isActive === false) {
      reset();
      remove();
      setEntryId('');
      handleIsOpen(false);
    } else {
      const result = await confirm({
        title: '저장하기',
        description: (
          <span>
            변경사항이 저장되지 않았습니다.
            <br />
            정말 나가시겠습니까?
          </span>
        ),
      });
      if (result) {
        reset();
        remove();
        setEntryId('');
        handleIsOpen(false);
      }
    }
  };

  return (
    <ReactModal
      style={{ overlay: { display: 'flex', background: 'transparent' } }}
      className="entityModal detail"
      isOpen={isOpen}
    >
      <div className="detail header">
        <div className="listBtn">
          <Button icon={icPrev} onClick={handleClose}>
            List
          </Button>
        </div>
        <button className="closeBtn" onClick={handleClose}>
          <img src={icPopupClose} alt="modal close btn"></img>
        </button>
      </div>
      <FormProvider {...formMethods}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="entitiesContainer">
            <div className="entitiesWrapper">
              <div className="entityDetailHeader">
                <Title level={2}>Entity</Title>
                <Button
                  type="primary"
                  large
                  onClick={() => {
                    trigger(['name', 'entries', 'isRegex']);
                    handleSave(getValues());
                  }}
                >
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
                      <Input
                        placeholder="엔티티명을 공백 없이 입력해주세요."
                        maxLength={20}
                        showCount
                        ref={nameField.ref}
                        value={nameField.value}
                        onChange={handleEntityName}
                        isError={
                          entryNameInputError || errors.name?.message ? true : false
                        }
                      />
                      <span className="error-message">{entryNameInputError}</span>
                      <span className="error-message">{errors.name?.message}</span>
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
                          {entryDetails?.data?.entryGroupType === 0 ? 'String' : 'Regex'}
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
                          <Input
                            placeholder="엔트리를 정규식으로 입력해주세요."
                            onChange={(e) => {
                              // setValue('entries.0.representativeEntry', e.target.value);
                              field.onChange([{ representativeEntry: e.target.value }]);
                              setIsActive(true);
                            }}
                            isError={
                              regexInputError || errors.entries?.[0]?.representativeEntry
                                ? true
                                : false
                            }
                            ref={field.ref}
                            value={field.value?.[0]?.representativeEntry || ''}
                          />
                          <span className="error-message">{regexInputError}</span>
                          <span className="error-message">
                            {errors.entries?.[0]?.representativeEntry?.message}
                          </span>
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
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  ></Input>
                </div>
              ) : null}
              <div className="registerEntry">
                {watch('isRegex') === false ||
                entryDetails?.data?.entryGroupType === 0 ? (
                  <Card className="entityDetail" radius="normal">
                    <Space direction="vertical" gap={10}>
                      <Row gap={8}>
                        <Col flex="auto">
                          <Input
                            placeholder="Input Representative entry."
                            size="normal"
                            maxLength={125}
                            showCount
                            value={synonym}
                            onPressEnter={() => {
                              handleRegisterEntry();
                              setIsActive(true);
                              trigger('entries');
                            }}
                            onChange={(e) => {
                              setIsActive(true);
                              setSynonym(e.target.value);
                            }}
                            isError={errors.entries?.message ? true : false}
                          ></Input>
                          <span className="error-message">{errors.entries?.message}</span>
                        </Col>
                        <Col>
                          <Button
                            type="primary"
                            onClick={() => {
                              handleRegisterEntry();
                            }}
                          >
                            Register
                          </Button>
                        </Col>
                      </Row>
                      <Space gap={8} direction="vertical">
                        {watch('entries').length === 0 ? (
                          <div className="emptyList">
                            <div className="empty">
                              <img src={icNoResult} alt="empty" />
                              <span>No entries registered</span>
                            </div>
                          </div>
                        ) : watch('isRegex') === false ||
                          entryDetails?.data?.entryGroupType === 0 ? (
                          <>
                            {fields.map((entryGroup, i) => {
                              return (
                                <EntityDetailItem
                                  key={entryGroup.id}
                                  index={i}
                                  entryGroup={entryGroup}
                                  entriesRemove={remove}
                                  searchKeyword={searchKeyword}
                                  setIsActive={setIsActive}
                                  trigger={trigger}
                                />
                              );
                            })}
                            {searchKeyword.trim() !== '' &&
                            getValues().entries.filter(
                              (x) =>
                                (x.representativeEntry &&
                                  x.representativeEntry?.includes(searchKeyword)) ||
                                (x.synonym &&
                                  x.synonym?.find((s) => s.includes(searchKeyword))),
                            ).length === 0 ? (
                              <div className="emptyList">
                                <div className="empty">
                                  <img src={icNoResult} alt="empty" />
                                  <span>No search results found.</span>
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </Space>
                    </Space>
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
