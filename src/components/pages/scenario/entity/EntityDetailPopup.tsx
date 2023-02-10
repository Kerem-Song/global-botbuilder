import { icPopupClose } from '@assets';
import { Button, Card, Col, Input, Radio, Row, Space, Title } from '@components';
import React, { Dispatch, FC } from 'react';
import ReactModal from 'react-modal';

export interface EntityDetailProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
  value?: string;
  onChange?: Dispatch<React.SetStateAction<string>>;
}

export const EntityDetailPopup: FC<EntityDetailProps> = ({ isOpen, handleIsOpen }) => {
  const handleClose = () => {
    handleIsOpen(false);
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
        <form>
          <div className="entityDetailHeader">
            <Title level={2}>Entity</Title>
            <Button type="primary" large>
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
                  <Input placeholder="Input Intent Name" showCount maxLength={20} />
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
              <Row align="center" gap={10}>
                <Col style={{ width: '140px' }}>
                  <span>Regular expression</span>
                </Col>
                <Col flex="auto">
                  <Input placeholder="Input Intent Name" showCount maxLength={20} />
                </Col>
              </Row>
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
              <Row>
                <Col flex="auto" style={{ display: 'flex' }}>
                  <Input size="normal"></Input>
                  <Button style={{ marginLeft: '8px' }} type="primary">
                    Register
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Input
                    size="normal"
                    style={{ width: '200px', marginRight: '8px' }}
                  ></Input>
                  <div className="entryList">
                    {/* <span
                      className="addEntry"
                      contentEditable
                      onInput={(e: React.ChangeEvent<HTMLSpanElement>) =>
                        onChange(e.target.innerText)
                      }
                    >
                      Entry 0-1
                    </span> */}
                    <div className="addBtnWrapper">
                      <button className="addBtn">
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                  <button className="icDelete" />
                </Col>
              </Row>
            </Space>
          </Card>
        </div>
      </div>
    </ReactModal>
  );
};
