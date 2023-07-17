import ReactLoadingSkeleton from 'react-loading-skeleton';

export const VariableSkeleton = () => {
  return (
    <div className="variableItem">
      <span className="variableInfo">
        <ReactLoadingSkeleton
          count={1}
          height={16}
          baseColor="rgba(0,0,0,0.06)"
          style={{ lineHeight: 2 }}
        />
      </span>
      <span className="variableInfo">
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
