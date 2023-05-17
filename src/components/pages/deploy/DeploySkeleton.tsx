import { util } from '@modules/util';
import ReactLoadingSkeleton from 'react-loading-skeleton';

export const DeploySkeleton = () => {
  return (
    <>
      {util.range(5).map((n) => (
        <tr key={n} className="list">
          <td className="deployHistoryList deployNumber">
            <ReactLoadingSkeleton
              count={1}
              height={16}
              baseColor="rgba(0,0,0,0.06)"
              style={{ lineHeight: 2 }}
            />
          </td>
          <td className="deployHistoryList channelType">
            <ReactLoadingSkeleton
              count={1}
              height={16}
              baseColor="rgba(0,0,0,0.06)"
              style={{ lineHeight: 2 }}
            />
          </td>
          <td className="deployHistoryList channelName">
            <ReactLoadingSkeleton
              count={1}
              height={16}
              width={`${util.random(100)}%`}
              baseColor="rgba(0,0,0,0.06)"
              style={{ lineHeight: 2 }}
            />
          </td>
          <td className="deployHistoryList deployDateTime">
            <ReactLoadingSkeleton
              count={1}
              height={16}
              baseColor="rgba(0,0,0,0.06)"
              style={{ lineHeight: 2 }}
            />
          </td>
          <td className="deployHistoryList accountInfo">
            <ReactLoadingSkeleton
              count={1}
              height={16}
              width={`${util.random(100)}%`}
              baseColor="rgba(0,0,0,0.06)"
              style={{ lineHeight: 2 }}
            />
            <ReactLoadingSkeleton
              count={1}
              height={16}
              baseColor="rgba(0,0,0,0.06)"
              style={{ lineHeight: 2 }}
            />
          </td>
          <td className="deployHistoryList status">
            <span className="success">
              <ReactLoadingSkeleton
                count={1}
                height={16}
                width={`${util.random(100)}%`}
                baseColor="rgba(0,0,0,0.06)"
                style={{ lineHeight: 2 }}
              />
            </span>
          </td>
          <td className="deployHistoryList memo text">
            <ReactLoadingSkeleton
              count={1}
              height={16}
              width={`${util.random(100)}%`}
              baseColor="rgba(0,0,0,0.06)"
              style={{ lineHeight: 2 }}
            />
          </td>
        </tr>
      ))}
    </>
  );
};
