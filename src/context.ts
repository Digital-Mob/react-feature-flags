import React from 'react';

import { FeatureFlagsMap } from './types';

export const FeatureFlagContext = React.createContext<FeatureFlagsMap>(new Map());
