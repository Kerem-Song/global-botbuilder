import { icDelete, icPlusWhite, icPopupClose, icSearchDelete } from '@assets';
import { Button, Col, Divider, Input, Row, Title } from '@components';
import { useModalOpen, usePage } from '@hooks';
import { useEntityClient } from '@hooks/client/entityClient';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { FC } from 'react';
import { useInView } from 'react-intersection-observer';
import ReactModal from 'react-modal';

import { EntityDetailPopup } from './EntityDetailPopup';
export const MyEntity = () => {
  const { isOpen, handleIsOpen } = useModalOpen();
  const [ref, inView] = useInView();
  const { changePageNumberQuery } = useEntityClient();
  const { data: initialData, fetchNextPage } = changePageNumberQuery;

  useEffect(() => {
    if (!initialData) {
      return;
    }
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <>
      <div className="entitiesTitle">
        <Title level={2}>Manage my entities</Title>
      </div>
      <div className="entity">
        <Button type="primary" onClick={() => handleIsOpen(true)}>
          <img src={icPlusWhite} alt="add" style={{ marginRight: '3px' }} />
          <span>Add entity</span>
        </Button>
        <Input size="small" search></Input>
      </div>
      <form className="entityWrapper">
        <Row gap={12}>
          {initialData?.pages.map((v) => {
            const pages = v.items;
            return pages.map((x, i) => {
              return (
                <Col key={i} span={6}>
                  <div className="entityCard" ref={ref}>
                    <div className="cardHeader">
                      <span className="title">{x.name}</span>
                      <button className="icDelete" />
                    </div>
                    <div className="entries">
                      <span className="entry">{x.entries}</span>
                    </div>
                  </div>
                </Col>
              );
            });
          })}
        </Row>
      </form>
      <EntityDetailPopup isOpen={isOpen} handleIsOpen={handleIsOpen} />
    </>
  );
};
