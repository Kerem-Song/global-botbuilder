import ReactLoadingSkeleton from 'react-loading-skeleton';

export const ParameterSkeleton = () => {
  return (
    <div className="parameterItem">
      <span className="parameterInfo">
        <ReactLoadingSkeleton
          count={1}
          height={16}
          baseColor="rgba(0,0,0,0.06)"
          style={{ lineHeight: 2 }}
        />
      </span>
      <span className="parameterInfo">
        <ReactLoadingSkeleton
          count={1}
          height={16}
          baseColor="rgba(0,0,0,0.06)"
          style={{ lineHeight: 2 }}
        />
      </span>
    </div>
  );
};
