import { FEATURE_FLAGS_STORAGE_KEY } from './constants';
import { FeatureFlagsMap } from './types';

export const loadFeatureFlags = (): FeatureFlagsMap | undefined => {
  const ffs = window.localStorage.getItem(FEATURE_FLAGS_STORAGE_KEY);

  if (ffs) {
    try {
      return new Map(JSON.parse(ffs));
    } catch (e) {
      //
    }
  }

  return undefined;
};

export const storeFeatureFlags = (flags: FeatureFlagsMap): void => {
  if (flags.size > 0) {
    const ffs = JSON.stringify(Array.from(flags.entries()));
    window.localStorage.setItem(FEATURE_FLAGS_STORAGE_KEY, ffs);
  } else {
    window.localStorage.removeItem(FEATURE_FLAGS_STORAGE_KEY);
  }
};
