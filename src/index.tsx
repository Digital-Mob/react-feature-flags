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

export const FeatureFlagsContext = React.createContext<FeatureFlagsMap>(new Map<string, FeatureFlag>());

export type FeatureFlagsProviderProps = {
  url: string;
  refreshInterval?: number;
};

export type FeatureFlagsProviderState = {
  featureFlags: FeatureFlagsMap;
};

export class FeatureFlagsProvider extends React.PureComponent<FeatureFlagsProviderProps, FeatureFlagsProviderState> {
  state = {
    featureFlags: new Map<string, FeatureFlag>(),
  };

  intervalID: NodeJS.Timeout = null;

  componentDidMount() {
    const { refreshInterval = FEATURE_FLAGS_REFRESH_INTERVAL } = this.props;
    const ff = loadFeatureFlags();

    if (ff) {
      this.setState(prevState => ({
        ...prevState,
        featureFlags: ff,
      }));
    }

    this.getFeaturesFlags();

    this.intervalID = setInterval(() => {
      this.getFeaturesFlags();
    }, refreshInterval);
  }

  componentWillUnmount() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }
  }

  render() {
    const { children } = this.props;
    const { featureFlags } = this.state;

    return (
      <FeatureFlagsContext.Provider value={featureFlags}>{children}</FeatureFlagsContext.Provider>
    );
  }

  getFeaturesFlags() {
    const { url } = this.props;

    fetchFeaturesFlags(url)
      .then(ff => {
        this.setState(prevState => ({
          ...prevState,
          featureFlags: ff,
        }));

        storeFeatureFlags(ff);
      });
  }
}

export type FeatureFlagsWidgetProps = {
  children: React.ReactElement;
  flags: string | string[];
  exact?: boolean;
  fallback?: () => React.ReactElement | null;
};

export const FeatureFlagsWidget = ({ children, flags, exact = true, fallback }: FeatureFlagsWidgetProps): React.ReactNode => {
  const ffs = [].concat(flags || []);

  return (
    <FeatureFlagsContext.Consumer>{featureFlags => {
      const isActive = exact
        ? ffs.every(flagName => featureFlags.has(flagName))
        : ffs.some(flagName => featureFlags.has(flagName));

      return isActive ? children : (fallback && fallback() || null);
    }}</FeatureFlagsContext.Consumer>
  );
};
