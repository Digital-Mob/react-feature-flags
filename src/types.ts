export type FeatureFlag = {
  name: string;
  description: string;
  enabled: boolean;
  strategies: {
    name: string;
  }[];
};

export type FeatureFlagsMap = Map<string, FeatureFlag>;
