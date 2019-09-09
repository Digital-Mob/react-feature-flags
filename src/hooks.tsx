import React from 'react';

const FEATURE_FLAGS_STORAGE_KEY: string = 'feature:flags';
const FEATURE_FLAGS_REFRESH_INTERVAL: number = 5 * 60 * 1000;

export type FeatureFlag = {
  name: string;
  description: string;
  enabled: boolean;
  strategies: {
    name: string;
  }[];
};

export type FeatureFlagsMap = Map<string, FeatureFlag>;

const loadFeatureFlags = (): FeatureFlagsMap | undefined => {
  const ffs = window.localStorage.getItem(FEATURE_FLAGS_STORAGE_KEY);

  if (ffs) {
    try {
      return new Map<string, FeatureFlag>(JSON.parse(ffs));
    } catch (e) {
      //
    }
  }

  return undefined;
};

const storeFeatureFlags = (flags: FeatureFlagsMap): void => {
  if (flags && flags.size > 0) {
    const ffs = JSON.stringify(Array.from(flags.entries()));
    window.localStorage.setItem(FEATURE_FLAGS_STORAGE_KEY, ffs);
  } else {
    window.localStorage.removeItem(FEATURE_FLAGS_STORAGE_KEY);
  }
};

const fetchFeaturesFlags = (url: string): Promise<FeatureFlagsMap> => {
  return window.fetch(url)
    .then(result => result.json())
    .then((result: { featureFlags: FeatureFlag[] }) => {
      const ff = (result && result.featureFlags) || [];

      return ff.reduce((a, c) => {
        if (c.enabled) {
          a.set(c.name, c);
        }

        return a;
      }, new Map<string, FeatureFlag>());
    });
};

const FeatureFlagsContext = React.createContext<FeatureFlagsMap>(new Map<string, FeatureFlag>());

export type FeatureFlagsProviderProps = {
  url: string;
  refreshInterval?: number;
};

export type FeatureFlagsProviderState = {
  featureFlags: FeatureFlagsMap;
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
      }

      getFeaturesFlags();

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

export const useFeatureFlags = (): [FeatureFlagsMap] => {
  const featureFlags = React.useContext<FeatureFlagsMap>(FeatureFlagsContext);

  return React.useMemo(() => [new Map<string, FeatureFlag>(featureFlags)], [featureFlags]);
};

export type FeatureFlagsWidgetProps = {
  children: React.ReactElement;
  flags: string | string[];
  exact?: boolean;
  fallback?: () => React.ReactElement | null;
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
