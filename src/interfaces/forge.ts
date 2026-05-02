export interface IForgeService {
  id: string;
  init(): Promise<void>;
  dispose(): void;
}

export interface ForgeCommand {
  type: ForgeCommandType;
  payload?: any;
}

export enum ForgeCommandType {
  PING = 'PING',
  LOG = 'LOG',
  METRICS_UPDATE = 'METRICS_UPDATE',
  RESOURCE_USAGE = 'RESOURCE_USAGE',
  TOOL_INVOKED = 'TOOL_INVOKED',
  SPAWN_SUBAGENT = 'SPAWN_SUBAGENT',
  UPDATE_SUBAGENT = 'UPDATE_SUBAGENT',
  SET_PHASE = 'SET_PHASE',
  BUDGET_EXCEEDED = 'BUDGET_EXCEEDED'
}

export interface WebviewMessage {
  command: ForgeCommandType | string;
  data?: any;
}
