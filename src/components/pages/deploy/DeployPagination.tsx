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
  const [currentPagesArray, setCurrentPageArray] = useState<number[]>([]);
  const [totalPagesArray, setTotalPageArray] = useState<number[][]>([]);
  const limit = 10;

  const limitedArray = (totalPages: number, limit: number) => {
    const totalPageArray = Array(totalPages)
      .fill(0)
      .map((_, i) => i + 1);

    return Array(Math.ceil(totalPages / limit))
      .fill(0)
      .map((_, i) => totalPageArray.slice(i * limit, i * limit + limit));
  };

  useEffect(() => {
    if (currentPage % limit === 1) {
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
        disabled={currentPage <= 10}
        onClick={() => {
          setCurrentPage(currentPage - 10);
        }}
      >
        <img src={currentPage >= 10 ? icBackActive : icBackInactive} alt="prev" />
      </Button>
      <div className="pageNumBtns">
        {data &&
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
          ))}
      </div>
      <Button
        shape="ghost"
        className="nextBtn"
        disabled={currentPage + 10 >= totalPages}
        onClick={() => setCurrentPage(currentPage + 10)}
      >
        <img
          src={currentPage + 10 >= totalPages ? icNextInactive : icNextActive}
          alt="next"
        ></img>
      </Button>
    </div>
  );
};
