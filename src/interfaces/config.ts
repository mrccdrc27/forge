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
  build?: {
    allowAbsolutePaths: boolean;
    defaultTargetPath: string;
    maxFilesPerBuild: number;
  };
  codebaseAnalyzer: {
    maxFilesToScan: number;
    maxCharsPerFile: number;
    totalCharBudget: number;
    excludePatterns: string[];
  };
  dependencyAdvisor: {
    registryUrl: string;
    maxChangelogChars: number;
  };
  cleanupScanner: {
    maxFilesToScan: number;
    staticOnly: boolean;
  };
}

// Made with Bob
