/// <reference types="node" />
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
export declare const FeatureFlagsContext: React.Context<Map<string, FeatureFlag>>;
export declare type FeatureFlagsProviderProps = {
    url: string;
    refreshInterval?: number;
};
export declare type FeatureFlagsProviderState = {
    featureFlags: FeatureFlagsMap;
};
export declare class FeatureFlagsProvider extends React.PureComponent<FeatureFlagsProviderProps, FeatureFlagsProviderState> {
    state: {
        featureFlags: Map<string, FeatureFlag>;
    };
    intervalID: NodeJS.Timeout;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    getFeaturesFlags(): void;
}
export declare type FeatureFlagsWidgetProps = {
    children: React.ReactElement;
    flags: string | string[];
    exact?: boolean;
    fallback?: () => React.ReactElement | null;
};
export declare const FeatureFlagsWidget: ({ children, flags, exact, fallback }: FeatureFlagsWidgetProps) => React.ReactNode;
