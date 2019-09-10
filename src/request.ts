import { FeatureFlag, FeatureFlagsMap } from './types';

export function fetchFeaturesFlags(url: string): Promise<FeatureFlagsMap> {
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
}
