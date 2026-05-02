export interface IForgeService {
  id: string;
  init(): Promise<void>;
  dispose(): void;
}

export interface ForgeCommand {
  type: string;
  payload?: any;
}
