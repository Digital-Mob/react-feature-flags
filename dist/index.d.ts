/// <reference types="node" />
import React from 'react';
import { FeatureFlag, FeatureFlagsProviderProps, FeatureFlagsProviderState, FeatureFlagsWidgetProps } from './types';
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
export declare const FeatureFlagsWidget: (props: FeatureFlagsWidgetProps) => React.ReactNode;
