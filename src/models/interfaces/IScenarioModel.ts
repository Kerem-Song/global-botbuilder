export interface IScenarioModel {
  id: string;
  alias: string;
  activated: boolean;
  isFallbackFlow: boolean;
  isStartFlow: boolean;
  seq: number;
  nodeOption: number;
  firstNodeId: string;
}
