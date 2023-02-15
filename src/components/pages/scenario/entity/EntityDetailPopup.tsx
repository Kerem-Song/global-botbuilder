import { icPopupClose, icUtteranceEmpty } from '@assets';
import { Button, Card, Col, Input, Radio, Row, Space, Title } from '@components';
import { useEntityClient, useRootState } from '@hooks';
import { IEntryFormModel, ISaveEntryGroup } from '@models';
import React, { Dispatch, FC, useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';

export interface EntityDetailProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
  value?: string;
  onChange?: Dispatch<React.SetStateAction<string>>;
  entryId?: string;
  setEntryId?: (value: string) => void;
}

export const EntityDetailPopup: FC<EntityDetailProps> = ({
  isOpen,
  handleIsOpen,
  entryId,
}) => {
  const { entryGroupMutate, entryGroupGetMutate } = useEntityClient();

  const token = useRootState((state) => state.botInfoReducer.token);

  const { reset, register, control, handleSubmit, getValues, watch } =
    useForm<ISaveEntryGroup>({
      defaultValues: {
        name: '',
        isRegex: false,
        entries: [],
      },
    });

  const entryForm = useForm<IEntryFormModel>({ defaultValues: { entry: '' } });
  const { fields, append, remove } = useFieldArray({ control, name: 'entries' });

  const handleRegisterEntry = (data: IEntryFormModel): void => {
    append({ representativeEntry: data.entry });
    entryForm.reset();
  };

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
          console.log('newEntry', submitResult);
          handleIsOpen(false);
          reset();
        },
      });
    }
  };

  const handleClose = () => {
    handleIsOpen(false);
    remove();
  };

  return (
    <ReactModal className="entityModal detail" isOpen={isOpen}>
      <div className="detail header">
        <Button>List</Button>
        <button className="closeBtn" onClick={handleClose}>
          <img src={icPopupClose} alt="delete"></img>
        </button>
      </div>
      <div className="entitiesWrapper">
        <form onSubmit={handleSubmit(handleSave)}>
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
                  <Radio>String</Radio>
                  <Radio>Regex</Radio>
                </Col>
              </Row>
              {/* <Row align="center" gap={10}>
                <Col style={{ width: '140px' }}>
                  <span>Regular expression</span>
                </Col>
                <Col flex="auto">
                  <Input placeholder="Input Intent Name" showCount maxLength={20} />
                </Col>
              </Row> */}
            </Space>
          </Card>
        </form>
        <div className="searchInput">
          <Input size="small" search></Input>
        </div>
        <div className="registerEntry">
          <Card
            radius="normal"
            bodyStyle={{ padding: '20px' }}
            style={{ border: '1px solid #DCDCDC', marginTop: '20px' }}
          >
            <Space direction="vertical">
              <form onSubmit={entryForm.handleSubmit(handleRegisterEntry)}>
                <Row>
                  <Col flex="auto" style={{ display: 'flex', marginBottom: '20px' }}>
                    <Input
                      {...entryForm.register('entry')}
                      placeholder="Input Representative entry."
                      size="normal"
                    ></Input>
                    <Button
                      style={{ marginLeft: '8px' }}
                      type="primary"
                      htmlType="submit"
                    >
                      Register
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <>
                    {watch('entries').length > 0 ? (
                      fields.map((v, i) => {
                        return (
                          <Col key={i}>
                            {/* <Input
                              size="normal"
                              style={{ width: '200px', marginRight: '8px' }}
                            >
                              {v.representativeEntry}
                            </Input> */}
                            <div
                              style={{
                                width: '200px',
                                marginRight: '8px',
                              }}
                            >
                              {v.representativeEntry}
                            </div>
                            <div className="entryList">
                              <div className="addBtnWrapper">
                                <button className="addBtn">
                                  <span>Add</span>
                                </button>
                              </div>
                            </div>
                            <button className="icDelete" />
                          </Col>
                        );
                      })
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
              </form>
            </Space>
          </Card>
        </div>
      </div>
    </ReactModal>
  );
};
