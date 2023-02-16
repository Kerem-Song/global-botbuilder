import { icPlusWhite } from '@assets';
import { Button, Col, Input, Row, Title } from '@components';
import { useModalOpen, useRootState, useSystemModal } from '@hooks';
import { useEntityClient } from '@hooks/client/entityClient';
import { IDeleteEntryGroup } from '@models';
import { lunaToast } from '@modules/lunaToast';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { EntityDetailPopup } from './EntityDetailPopup';

export const MyEntity = () => {
  const [entryId, setEntryId] = useState('');
  const { isOpen, handleIsOpen } = useModalOpen();
  const [ref, inView] = useInView();
  const { changePageNumberQuery, entryGroupDeleteMutate } = useEntityClient();
  const { data: initialData, fetchNextPage } = changePageNumberQuery;
  const token = useRootState((state) => state.botInfoReducer.token);

  const { confirm } = useSystemModal();

  const openDeleteEntryModal = async (id: string) => {
    const result = await confirm({
      title: 'Delete',
      description: (
        <span>
          There is a scenario associated with scenario 02
          <br />: Start, Scenario 01
          <br />
          Are you sure you want to delete it?
        </span>
      ),
    });

    if (result) {
      const deleteEntry: IDeleteEntryGroup = {
        sessionToken: token,
        entryGroupId: id,
      };
      entryGroupDeleteMutate.mutate(deleteEntry, {
        onSuccess: (submitResult) => {
          console.log(submitResult);
        },
      });
    }
  };

  const handleEntryDetail = (id: string) => {
    setEntryId(id);
    handleIsOpen(true);
  };

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
      <div className="entityWrapper">
        <Row gap={12}>
          {initialData?.pages.map((v) => {
            const pages = v.items;
            return pages.map((x, i) => {
              return (
                <Col key={i} span={6}>
                  <div
                    className="entityCard"
                    role="presentation"
                    onClick={() => handleEntryDetail(x.id)}
                    ref={ref}
                  >
                    <div className="cardHeader">
                      <span className="title">{x.name}</span>
                      <button
                        className="icDelete"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteEntryModal(x.id);
                        }}
                      />
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
        {isOpen && (
          <EntityDetailPopup
            isOpen={isOpen}
            handleIsOpen={handleIsOpen}
            entryId={entryId}
            setEntryId={setEntryId}
          />
        )}
      </div>
    </>
  );
};
