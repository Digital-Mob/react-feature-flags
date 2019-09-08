import React from 'react';

import { FeatureFlagContext } from './context';

export type FeatureFlagWidgetProps = {
  children: React.ReactNode;
  name: string;
};

export const FeatureFlagWidget = ({ children, name }: FeatureFlagWidgetProps): React.ReactNode => (
  <FeatureFlagContext.Consumer>{ff => ff.has(name) && children}</FeatureFlagContext.Consumer>
);
