import { icPlusWhite, icUtteranceEmpty } from '@assets';
import { Button, Card, Col, Input, Row, Title } from '@components';
import { useModalOpen, useRootState, useSystemModal } from '@hooks';
import { useEntityClient } from '@hooks/client/entityClient';
import { IDeleteEntryGroup, IPagingItems, IResponseEntryItems } from '@models';
import { lunaToast } from '@modules/lunaToast';
import { InfiniteData } from '@tanstack/react-query';
import { t } from 'i18next';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { EntityDetailPopup } from './EntityDetailPopup';

export const MyEntity = () => {
  const [entryId, setEntryId] = useState('');
  const [searchKeyword, setSearchKeyword] = useState<string>();
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

  const isExistInitialData = (
    data: InfiniteData<IPagingItems<IResponseEntryItems>> | undefined,
  ): boolean => {
    if (data?.pages && data?.pages?.reduce((acc, cur) => acc + cur.totalPage, 0) > 0) {
      return true;
    }

    return false;
  };

  useEffect(() => {
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
        <Input
          size="small"
          search
          value={searchKeyword}
          onSearch={setSearchKeyword}
        ></Input>
      </div>
      <div className="entityWrapper">
        <Row gap={12}>
          {isExistInitialData(initialData) ? (
            initialData?.pages.map((v) => {
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
                        <span className="title">{x.usingName}</span>
                        <button
                          className="icDelete"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteEntryModal(x.id);
                          }}
                        />
                      </div>
                      <div className="entries">
                        <>
                          <span className="entry">
                            {_.first(x.entries)?.includes('#')
                              ? _.first(x.entries)
                                  ?.split('/t')
                                  .filter((item) => item.includes('#'))
                                  .map((item) => _.last(item.split('#'))?.concat(' '))
                              : x.entries.map((item) => item.concat(' '))}
                          </span>
                        </>
                      </div>
                    </div>
                  </Col>
                );
              });
            })
          ) : (
            <Card
              className="test"
              radius="normal"
              bodyStyle={{ padding: '20px' }}
              style={{
                border: '1px solid #DCDCDC',
                marginTop: '20px',
                width: '1080px',
                height: '440px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Row
                style={{
                  width: '100%',
                  marginTop: '12px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div className="emptyList">
                  <div
                    className="empty"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <img src={icUtteranceEmpty} alt="empty" />
                    <span>No entries registered</span>
                  </div>
                </div>
              </Row>
            </Card>
          )}
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
