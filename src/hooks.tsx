import React from 'react';

import { FEATURE_FLAGS_REFRESH_INTERVAL } from './constants';
import {
  FeatureFlag,
  FeatureFlagsMap,
  FeatureFlagsProviderProps,
  FeatureFlagsProviderState,
  FeatureFlagsWidgetProps,
} from './types';
import { FeatureFlagsContext } from './context';
import { loadFeatureFlags, storeFeatureFlags } from './storage';
import { fetchFeaturesFlags } from './request';

export const useFeatureFlags = (): [FeatureFlagsMap] => {
  const featureFlags = React.useContext<FeatureFlagsMap>(FeatureFlagsContext);

  return React.useMemo(() => [new Map<string, FeatureFlag>(featureFlags)], [featureFlags]);
};

export const FeatureFlagsProvider: React.FunctionComponent<FeatureFlagsProviderProps> =
  ({ children, url, refreshInterval = FEATURE_FLAGS_REFRESH_INTERVAL }) => {
    const [state, setState] = React.useState<FeatureFlagsProviderState>({
      featureFlags: new Map<string, FeatureFlag>(),
    });

    const getFeaturesFlags = React.useCallback(() => {
      fetchFeaturesFlags(url)
        .then(ff => {
          setState(prevState => ({
            ...prevState,
            featureFlags: ff,
          }));

          storeFeatureFlags(ff);
        });
    }, [url]);

    React.useEffect(() => {
      const ff = loadFeatureFlags();

      if (ff) {
        setState(prevState => ({
          ...prevState,
          featureFlags: ff,
        }));
      } else {
        getFeaturesFlags();
      }

      const intervalID = setInterval(() => {
        getFeaturesFlags();
      }, refreshInterval);

      return () => {
        clearInterval(intervalID);
      };
    }, []);

    return (
      <FeatureFlagsContext.Provider value={state.featureFlags}>{children}</FeatureFlagsContext.Provider>
    );
  };

export const FeatureFlagsWidget: React.FunctionComponent<FeatureFlagsWidgetProps> =
  ({ children, flags, exact = true, fallback }) => {
    const [featureFlags] = useFeatureFlags();
    const ffs = [].concat(flags || []);
    const isActive = exact
      ? ffs.every(flagName => featureFlags.has(flagName))
      : ffs.some(flagName => featureFlags.has(flagName));

    return isActive ? children : (fallback && fallback() || null);
  };
