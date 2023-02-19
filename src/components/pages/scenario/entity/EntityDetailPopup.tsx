import { icPopupClose, icPrev, icUtteranceEmpty } from '@assets';
import { Button, Card, Col, Input, Radio, Row, Space, Title } from '@components';
import { useEntityClient, useRootState } from '@hooks';
import { IEntryFormModel, ISaveEntryGroup } from '@models';
import { t } from 'i18next';
import React, { Dispatch, FC, useEffect, useRef, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';

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
  selectedOption,
}) => {
  const [searchKeyword, setSearchKeyword] = useState<string>();
  const entryGroupName = useRef<HTMLInputElement>(null);
  const { entryGroupMutate, entryGroupGetMutate, getEntryDetailQuery } =
    useEntityClient();
  const token = useRootState((state) => state.botInfoReducer.token);
  const entryDetails = getEntryDetailQuery(entryId);
  const formMethods = useForm<ISaveEntryGroup>({
    defaultValues: {
      name: entryId,
      isRegex: false,
      entries: [],
    },
  });
  const { reset, register, control, handleSubmit, watch } = formMethods;
  const { fields, append, remove } = useFieldArray({ control, name: 'entries' });
  const entryForm = useForm<IEntryFormModel>({ defaultValues: { entry: '' } });
  const handleSave = (entryData: ISaveEntryGroup): void => {
    const newEntry: ISaveEntryGroup = {
      sessionToken: token,
      name: entryData.name,
      // isRegex: entryData.isRegex,
      isRegex: false,
      entries: entryData.entries,
    };

    entryGroupMutate.mutate(newEntry, {
      onSuccess: (submitResult) => {
        console.log('newEntry', submitResult);
        handleIsOpen(false);
        reset();
      },
    });

    if (entryData.entryGroupid) {
      const modifyEntry: ISaveEntryGroup = {
        sessionToken: token,
        name: entryData.name,
        // isRegex: entryData.isRegex,
        isRegex: false,
        entries: entryData.entries,
        entryGroupid: entryData.entryGroupid,
      };

      entryGroupMutate.mutate(modifyEntry, {
        onSuccess: (submitResult) => {
          console.log('modifyEntry', submitResult);
          handleIsOpen(false);
          reset();
        },
      });
    }
  };

  const handleRegisterEntry = (name?: string): void => {
    if (!name) {
      return;
    }
    append({ representativeEntry: name });
    if (entryGroupName.current) {
      entryGroupName.current.value = '';
    }
  };

  const handleClose = () => {
    handleIsOpen(false);
    setEntryId('');
    remove();
    reset();
  };

  useEffect(() => {
    if (entryDetails && entryDetails.data) {
      const resetValue = {
        entryGroupid: entryDetails.data.id,
        name: entryDetails.data.name,
        isRegex: false,
        entryGroupType: entryDetails.data.entryGroupType,
        entries: entryDetails.data.entries,
      };
      reset(resetValue);

      // append(
      //   entryDetails.data.entries!.map<IEntriesModel>((x) => {
      //     return { representativeEntry: x.representativeEntry, synonym: x.synonym } || [];
      //   }),
      // );
    }
  }, [entryDetails?.data]);

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
                    </Col>
                    <Col flex="auto">
                      <Input
                        {...register('name')}
                        placeholder="Input Intent Name"
                        showCount
                        maxLength={20}
                      />
                    </Col>
                  </Row>
                  <Row align="center" gap={10} style={{ marginBottom: '20px' }}>
                    <Col style={{ width: '140px' }}>
                      <span>Entry type</span>
                    </Col>
                    <Col style={{ display: 'flex' }}>
                      {watch('entryGroupid') ? (
                        <>
                          {entryDetails?.data?.entryGroupType === 0 ? 'String' : 'Regax'}
                        </>
                      ) : (
                        <>
                          <Radio
                            value="0"
                            checked
                            {...register('entryGroupType', { valueAsNumber: true })}
                          >
                            String
                          </Radio>
                          <Radio
                            value="2"
                            {...register('entryGroupType', { valueAsNumber: true })}
                          >
                            Regex
                          </Radio>
                        </>
                      )}
                    </Col>
                  </Row>
                  {/* <div>
                  {watch('entryGroupid') === undefined ? (
                    <>
                      {entryDetails?.data?.entryGroupType === 0 ? (
                        <Row align="center" gap={10}>
                          <Col style={{ width: '140px' }}>
                            <span>Regular expression</span>
                          </Col>
                          <Col flex="auto">
                            <Input
                              placeholder="Input Intent Name"
                              showCount
                              maxLength={20}
                            />
                          </Col>
                        </Row>
                      ) : null}
                    </>
                  ) : null}
                </div> */}
                </Space>
              </Card>
              <div className="searchInput">
                <Input
                  size="small"
                  search
                  value={searchKeyword}
                  onSearch={setSearchKeyword}
                ></Input>
              </div>
              <div className="registerEntry">
                <Card
                  radius="normal"
                  bodyStyle={{ padding: '20px' }}
                  style={{ border: '1px solid #DCDCDC', marginTop: '20px' }}
                >
                  <Space direction="vertical">
                    <Row>
                      <Col flex="auto" style={{ display: 'flex', marginBottom: '20px' }}>
                        <Input
                          {...entryForm.register('entry')}
                          placeholder="Input Representative entry."
                          size="normal"
                          ref={entryGroupName}
                          onPressEnter={handleRegisterEntry}
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
                  </Space>
                  <Row gap={8}>
                    <>
                      {watch('entries').length > 0 ? (
                        <>
                          {fields.map((entryGroup, i) => {
                            return (
                              <EntityDetailItem
                                entryGroup={entryGroup}
                                index={i}
                                key={i}
                              />
                            );
                          })}
                        </>
                      ) : (
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
                      )}
                    </>
                  </Row>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </ReactModal>
  );
};
