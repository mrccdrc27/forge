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
  TOOL_INVOKED = 'TOOL_INVOKED'
}

export interface WebviewMessage {
  command: ForgeCommandType;
  data?: any;
}
