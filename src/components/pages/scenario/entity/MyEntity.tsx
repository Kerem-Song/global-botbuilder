import { icPlusWhite } from '@assets';
import { Button, Col, Input, Row, Title } from '@components';
import { usePage, useRootState, useSystemModal } from '@hooks';
import { useEntityClient } from '@hooks/client/entityClient';
import { IDeleteEntryGroup, IPagingItems, IResponseEntryItems } from '@models';
import { util } from '@modules/util';
import { InfiniteData } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import MultiClamp from 'react-multi-clamp';
import { useDebouncedCallback } from 'use-debounce';

import { EmptyEntityCard } from './EmptyEntityCard';
import { EntitySkeleton } from './EntitySkeleton';

export interface IMyEntityProps {
  handleIsOpen: (value: boolean) => void;
  setEntryId: (value: string) => void;
  handleIsOpenEntityDetailPopup: (value: boolean) => void;
}

export const MyEntity: FC<IMyEntityProps> = ({
  setEntryId,
  handleIsOpenEntityDetailPopup,
  handleIsOpen,
}) => {
  const { t } = usePage();
  const { changePageNumberQuery, entryGroupDeleteAsync } = useEntityClient();
  const { confirm } = useSystemModal();
  const token = useRootState((state) => state.botInfoReducer.token);
  const [ref, inView] = useInView();
  const [searchKeyword, setSearchKeyword] = useState<string>();
  const {
    data: initialData,
    fetchNextPage,
    isFetching,
    isFetchedAfterMount,
  } = changePageNumberQuery(searchKeyword, false);

  const handleSearch = useDebouncedCallback((keyword?: string) => {
    setSearchKeyword(keyword);
  }, 500);

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
      const res = await entryGroupDeleteAsync(deleteEntry);

      if (res && res.isSuccess) {
        console.log('res', res);
      }
    }
  };

  const handleEntryDetail = (id: string) => {
    setEntryId(id);
    handleIsOpen(false);
    handleIsOpenEntityDetailPopup(true);
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
          icon={icPlusWhite}
          onClick={() => {
            handleIsOpen(false);
            handleIsOpenEntityDetailPopup(true);
          }}
        >
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
        />
      </div>
      <div className="entityWrapper">
        <Row gap={12}>
          {isFetching && !isFetchedAfterMount && <EntitySkeleton />}
          {isFetchedAfterMount && isExistInitialData(initialData)
            ? initialData?.pages.map((v) => {
                const pages = v.items;
                return pages.map((x, i) => {
                  return (
                    <Col key={i} span={6}>
                      <div
                        ref={ref}
                        className="entityCard"
                        role="presentation"
                        onClick={() => handleEntryDetail(x.id)}
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
                          <div className="entry">
                            {util.replaceKeywordMark(x.entries.join(', '), searchKeyword)}
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                });
              })
            : !isFetching &&
              initialData?.pages[0].items.length === 0 && (
                <EmptyEntityCard searchKeyword={searchKeyword} />
              )}
        </Row>
      </div>
    </>
  );
};
