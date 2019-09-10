import { FEATURE_FLAGS_REFRESH_INTERVAL, FEATURE_FLAGS_STORAGE_KEY } from './constants';
import { FeatureFlag, FeatureFlagsMap, FeatureFlagsStore } from './types';

export function loadFeatureFlags(): FeatureFlagsMap | undefined {
  const ffStr = window.localStorage.getItem(FEATURE_FLAGS_STORAGE_KEY);

  if (ffStr) {
    try {
      const ffObj = JSON.parse(ffStr) as FeatureFlagsStore;

      if ((ffObj.createdAt || 0) + FEATURE_FLAGS_REFRESH_INTERVAL >= Date.now()) {
        return new Map<string, FeatureFlag>(ffObj.flags);
      }
    } catch (e) {
      //
    }
  }

  return undefined;
}

export function storeFeatureFlags(flags: FeatureFlagsMap): void {
  if (flags && flags.size > 0) {
    const ffStr = JSON.stringify({
      flags: Array.from(flags.entries()),
      createdAt: Date.now(),
    } as FeatureFlagsStore);

    window.localStorage.setItem(FEATURE_FLAGS_STORAGE_KEY, ffStr);
  } else {
    window.localStorage.removeItem(FEATURE_FLAGS_STORAGE_KEY);
  }
}
