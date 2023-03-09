import { icPlusWhite, icUtteranceEmpty } from '@assets';
import { Button, Card, Col, Input, Row, Title } from '@components';
import { useModalOpen, useRootState, useSystemModal } from '@hooks';
import { useEntityClient } from '@hooks/client/entityClient';
import { IDeleteEntryGroup, IPagingItems, IResponseEntryItems } from '@models';
import { util } from '@modules/util';
import { InfiniteData } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import MultiClamp from 'react-multi-clamp';

import { EntityDetailPopup } from './EntityDetailPopup';

export const MyEntity = () => {
  const [entryId, setEntryId] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>();
  const [searchKeywordParameter, setSearchKeywordParameter] = useState<string>();
  const { isOpen, handleIsOpen } = useModalOpen();
  const [ref, inView] = useInView();
  const { changePageNumberQuery, entryGroupDeleteMutate } = useEntityClient();
  const { data: initialData, fetchNextPage } = changePageNumberQuery(
    searchKeywordParameter,
    false,
  );

  const handleSearch = (keyword?: string) => {
    setSearchKeyword(keyword);
    setSearchKeywordParameter(keyword);
  };
  const token = useRootState((state) => state.botInfoReducer.token);

  const { confirm } = useSystemModal();

  const openDeleteEntryModal = async (id: string) => {
    const result = await confirm({
      title: '엔티티 삭제',
      description: (
        <span>
          엔티티를 삭제하면 해당 엔티티를 사용하는 시나리오가
          <br /> 정상 작동 하지 않을 수 있습니다.
          <br /> 정말 삭제하시겠습니까?
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
          placeholder="Input search word"
          onBlur={(e) => {
            handleSearch(e.target.value);
          }}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onSearch={(value) => {
            handleSearch(value);
          }}
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
                        <span className="title">
                          {util.replaceKeywordMark(x.usingName, searchKeyword)}
                        </span>
                        <button
                          className="icDelete"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteEntryModal(x.id);
                          }}
                        />
                      </div>
                      <div className="entries">
                        <div>
                          <span className="entry">
                            <MultiClamp clamp={4}>
                              {util.replaceKeywordMark(
                                x.entries.join(' '),
                                searchKeyword,
                              )}
                            </MultiClamp>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              });
            })
          ) : (
            <Card
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
                  <img
                    src={icUtteranceEmpty}
                    alt="empty"
                    style={{ marginBottom: '10px' }}
                  />
                  {searchKeyword ? (
                    <span>No search results found.</span>
                  ) : (
                    <span>No entries registered</span>
                  )}
                </div>
              </div>
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
