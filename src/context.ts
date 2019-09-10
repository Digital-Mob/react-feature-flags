import React from 'react';

import { FeatureFlag, FeatureFlagsMap } from './types';

export const FeatureFlagsContext = React.createContext<FeatureFlagsMap>(new Map<string, FeatureFlag>());
