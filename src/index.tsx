import React from 'react';

import { FEATURE_FLAGS_REFRESH_INTERVAL } from './constants';
import { FeatureFlag, FeatureFlagsProviderProps, FeatureFlagsProviderState, FeatureFlagsWidgetProps } from './types';
import { FeatureFlagsContext } from './context';
import { loadFeatureFlags, storeFeatureFlags } from './storage';
import { fetchFeaturesFlags } from './request';

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
    } else {
      this.getFeaturesFlags();
    }

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

export const FeatureFlagsWidget = (props: FeatureFlagsWidgetProps): React.ReactNode => {
  const { children, flags, exact = true, fallback } = props;
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
