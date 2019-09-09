<h1 align="center">
  react-feature-flag
</h1>

<details>
<summary>📖 Table of Contents</summary>
<p>

- [About](#about)
- [Getting Started](#getting-started)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [Using Hooks](#using-hooks)
- [License](#license)

</p>
</details>

## About

`react-feature-flags` is a small library that provides a powerful technique, allowing teams to modify application's behavior without changing code.

## Getting Started

To get it started, add `git+ssh://git@github.com/Digital-Mob/react-feature-flags.git` to your project:

```
npm install --save git+ssh://git@github.com/Digital-Mob/react-feature-flags.git
```

Please note that `react-feature-flags` requires `react@^16.3.1` as a peer dependency.

## Examples

### Basic Usage

```jsx
import { FeatureFlagsProvider, FeatureFlagsWidget } from 'react-feature-flags';

const FEATURE_FLAG_URL = 'https://<:host>/feature-flags';

export default function App() {
  return (
    <FeatureFlagsProvider url={FEATURE_FLAG_URL}>
      ...
      <FeatureFlagsWidget flags="feature-one">
        Shown only if `feature-one` flag is active
        ...
      </FeatureFlagsWidget>
      <FeatureFlagsWidget flags={['feature-one', 'feature-two']}>
        Shown only if at least one provided flag is active
        ...
      </FeatureFlagsWidget>
      <FeatureFlagsWidget flags={['feature-one', 'feature-two']} exact>
        Shown only if all provided flags are active
        ...
      </FeatureFlagsWidget>
    </FeatureFlagsProvider>
  );
}
```

### Using Hooks

```jsx
import { FeatureFlagsProvider, FeatureFlagsWidget, useFeatureFlags } from 'react-feature-flags/dist/hooks';

const FEATURE_FLAG_URL = 'https://<:host>/feature-flags';

const FeatureOne = () => {
  const [featureFlags] = useFeatureFlags();

  return featureFlags.has('feature-one') && (
    <div>...</div>
  );
};

export default function App() {
  return (
    <FeatureFlagsProvider url={FEATURE_FLAG_URL}>
      ...
      <FeatureOne />
      <FeatureFlagsWidget flags="feature-two" exact>
        ...
      </FeatureFlagsWidget>
    </FeatureFlagsProvider>
  );
}
```

## License

MIT
