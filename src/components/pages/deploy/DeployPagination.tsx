import { icBackActive, icBackInactive, icNextActive, icNextInactive } from '@assets';
import { Button } from '@components';
import { IHasResult, IPagingItems } from '@models';
import { IResponseSearchDeployHistory } from '@models/interfaces/IDeploy';
import classNames from 'classnames';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

export interface IDeployPagination {
  data: IHasResult<IPagingItems<IResponseSearchDeployHistory>> | undefined;
  totalPages: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

export const DeployPagination: FC<IDeployPagination> = ({
  data,
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  const limit = 10;
  const [currentPagesArray, setCurrentPageArray] = useState<number[]>([]);
  const [totalPagesArray, setTotalPageArray] = useState<number[][]>([]);

  const limitedArray = (totalPages: number, limit: number) => {
    const totalPageArray = Array(totalPages)
      .fill(0)
      .map((_, i) => i + 1);
    return Array(Math.ceil(totalPages / limit))
      .fill(0)
      .map((_, i) => totalPageArray.slice(i * limit, i * limit + limit));
  };

  const handleNextBtn = () => {
    const lastPageArray = totalPagesArray[totalPagesArray.length - 1];
    const nextPage = currentPage + limit;
    if (nextPage >= totalPages) {
      setCurrentPage(lastPageArray[lastPageArray.length - 1]);
    } else {
      setCurrentPage(nextPage);
    }
  };

  useEffect(() => {
    if (currentPage % limit !== 0) {
      setCurrentPageArray(totalPagesArray[Math.floor(currentPage / limit)]);
    } else if (currentPage % limit === 0) {
      setCurrentPageArray(totalPagesArray[Math.floor(currentPage / limit) - 1]);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (data) {
      const slicedPageArray = limitedArray(totalPages, limit);
      setTotalPageArray(slicedPageArray);
      setCurrentPageArray(slicedPageArray[0]);
    }
  }, [totalPages]);
  return (
    <div className="pageBtns">
      <Button
        shape="ghost"
        className="prevBtn"
        disabled={currentPage <= limit}
        onClick={() => {
          setCurrentPage(currentPage - limit);
        }}
      >
        <img src={currentPage > limit ? icBackActive : icBackInactive} alt="prev" />
      </Button>
      <div className="pageNumBtns">
        {data && data?.result.items.length > 0 ? (
          currentPagesArray &&
          currentPagesArray.map((index) => (
            <Button
              key={index}
              className={classNames('pageNumBtn', {
                active: currentPage === index,
              })}
              onClick={() => setCurrentPage(index)}
            >
              {index}
            </Button>
          ))
        ) : (
          <Button
            className={classNames('pageNumBtn', {
              active: currentPage,
            })}
          >
            {currentPage}
          </Button>
        )}
      </div>
      <Button
        shape="ghost"
        className="nextBtn"
        disabled={
          currentPagesArray === totalPagesArray[totalPagesArray.length - 1] ||
          currentPage > totalPages
            ? true
            : false
        }
        onClick={handleNextBtn}
      >
        <img
          src={
            currentPagesArray === totalPagesArray[totalPagesArray.length - 1] ||
            currentPage > totalPages
              ? icNextInactive
              : icNextActive
          }
          alt="next"
        />
      </Button>
    </div>
  );
};
