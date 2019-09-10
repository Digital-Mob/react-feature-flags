import React from 'react';

export type FeatureFlag = {
  name: string;
  description: string;
  enabled: boolean;
  strategies: {
    name: string;
  }[];
};

export type FeatureFlagsMap = Map<string, FeatureFlag>;

export type FeatureFlagsStore = {
  flags: [string, FeatureFlag][];
  createdAt: number;
}

export type FeatureFlagsProviderProps = {
  url: string;
  refreshInterval?: number;
};

export type FeatureFlagsProviderState = {
  featureFlags: FeatureFlagsMap;
};

export type FeatureFlagsWidgetProps = {
  children: React.ReactElement;
  flags: string | string[];
  exact?: boolean;
  fallback?: () => React.ReactElement | null;
};
