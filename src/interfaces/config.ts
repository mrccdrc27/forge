export interface ForgeConfig {
  server: {
    port: number;
    host: string;
  };
  watsonx: {
    baseUrl: string;
    models: {
      reasoning: string;
      execution: string;
    };
  };
  budget: {
    maxBobcoins: number;
    toolOverheadBuffer: number;
    costs: {
      llama: number;
      granite: number;
    };
  };
  workspace: {
    requireWorkspaceFolder: boolean;
    defaultScaffoldPath: string;
  };
}

// Made with Bob
