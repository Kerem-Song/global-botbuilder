import { icNoResult, icPlusWhite } from '@assets';
import { Button, Card, Col, Input, Row, Title } from '@components';
import { useModalOpen, usePage, useRootState, useSystemModal } from '@hooks';
import { useEntityClient } from '@hooks/client/entityClient';
import { IDeleteEntryGroup, IPagingItems, IResponseEntryItems } from '@models';
import { util } from '@modules/util';
import { InfiniteData } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import MultiClamp from 'react-multi-clamp';

import { EntityDetailPopup } from './EntityDetailPopup';

export const MyEntity = () => {
  const { t } = usePage();
  const { isOpen, handleIsOpen } = useModalOpen();
  const { changePageNumberQuery, entryGroupDeleteMutate } = useEntityClient();
  const { confirm } = useSystemModal();
  const token = useRootState((state) => state.botInfoReducer.token);
  const [ref, inView] = useInView();
  const [entryId, setEntryId] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>();
  const { data: initialData, fetchNextPage } = changePageNumberQuery(
    searchKeyword,
    false,
  );

  const handleSearch = (keyword?: string) => {
    setSearchKeyword(keyword);
  };

  const openDeleteEntryModal = async (id: string) => {
    const result = await confirm({
      title: t('DELETE_ENTITY'),
      description: <p style={{ whiteSpace: 'pre-wrap' }}>{t('DELETE_ENTITY_MESSAGE')}</p>,
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
        <Title level={2}>{t('MANAGE_MY_ENTITIES')}</Title>
      </div>
      <div className="entity">
        <Button
          type="primary"
          onClick={() => {
            handleIsOpen(true);
          }}
        >
          <img src={icPlusWhite} alt="add" style={{ marginRight: '3px' }} />
          <span>{t('ADD_ENTITY')}</span>
        </Button>
        <Input
          size="small"
          search
          placeholder={t('INPUT_SEARCH_WORD')}
          onSearch={(value) => {
            handleSearch(value);
          }}
          onChange={(e) => {
            handleSearch(e.target.value);
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
                        <span className="entry">
                          <MultiClamp clamp={4}>
                            {util.replaceKeywordMark(x.entries.join(', '), searchKeyword)}
                          </MultiClamp>
                        </span>
                      </div>
                    </div>
                  </Col>
                );
              });
            })
          ) : (
            <Card radius="normal" className="emptyEntityCardWrapper">
              <div className="emptyEntityCard">
                <img className="emptyImg" src={icNoResult} alt="empty" />
                {searchKeyword ? (
                  <span>{t('NO_SEARCH_ENTRIES_RESULT_FOUND')}</span>
                ) : (
                  <span>{t('NO_ENTRIES_REGISTERED')}</span>
                )}
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
