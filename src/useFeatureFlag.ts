import { useContext } from 'react';

import { FeatureFlagContext } from './context';
import { FeatureFlagsMap } from './types';

export const useFeatureFlag = (): FeatureFlagsMap => {
  return useContext<FeatureFlagsMap>(FeatureFlagContext);
};
