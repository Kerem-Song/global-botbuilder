import { UtteranceListHeader } from './UtteranceListHeader';
import { UtteranceListItem } from './UtteranceListItem';

export const UtteranceList = () => {
  return (
    <table className="utteranceTable">
      <thead>
        <UtteranceListHeader />
      </thead>
      <tbody>
        <UtteranceListItem />
      </tbody>
    </table>
  );
};
