import React from 'react';

import { FEATURE_FLAGS_REFRESH_INTERVAL } from './constants';
import { fetchFeaturesFlags } from './api';
import { FeatureFlagContext } from './context';
import { loadFeatureFlags } from './storage';
import { FeatureFlagsMap } from './types';

export type FeatureFlagProviderProps = {
  url: string;
  refreshInterval?: number;
};

export type FeatureFlagProviderState = {
  featureFlags: FeatureFlagsMap;
};

export class FeatureFlagProvider extends React.PureComponent<FeatureFlagProviderProps, FeatureFlagProviderState> {
  state = {
    featureFlags: new Map(),
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
      <FeatureFlagContext.Provider value={featureFlags}>{children}</FeatureFlagContext.Provider>
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
      });
  }
}
