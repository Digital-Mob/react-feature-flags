import React from 'react';
export declare type FeatureFlag = {
    name: string;
    description: string;
    enabled: boolean;
    strategies: {
        name: string;
    }[];
};
export declare type FeatureFlagsMap = Map<string, FeatureFlag>;
export declare type FeatureFlagsProviderProps = {
    url: string;
    refreshInterval?: number;
};
export declare type FeatureFlagsProviderState = {
    featureFlags: FeatureFlagsMap;
};
export declare const FeatureFlagsProvider: React.FunctionComponent<FeatureFlagsProviderProps>;
export declare const useFeatureFlags: () => [Map<string, FeatureFlag>];
export declare type FeatureFlagsWidgetProps = {
    children: React.ReactElement;
    flags: string | string[];
    exact?: boolean;
    fallback?: () => React.ReactElement | null;
};
export declare const FeatureFlagsWidget: React.FunctionComponent<FeatureFlagsWidgetProps>;
