import React from 'react';
import { FeatureFlag, FeatureFlagsProviderProps, FeatureFlagsWidgetProps } from './types';
export declare const useFeatureFlags: () => [Map<string, FeatureFlag>];
export declare const FeatureFlagsProvider: React.FunctionComponent<FeatureFlagsProviderProps>;
export declare const FeatureFlagsWidget: React.FunctionComponent<FeatureFlagsWidgetProps>;
