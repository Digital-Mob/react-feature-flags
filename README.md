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
  - [Hooks Usage](#hooks-usage)
- [License](#license)

</p>
</details>

## About

`react-feature-flags` is a small library that provides a powerful technique, allowing teams to modify application's behavior without changing code.

## Getting Started

To get it started, add `git+https://github.com/Digital-Mob/react-feature-flags.git` to your project:

```
npm install --save git+https://github.com/Digital-Mob/react-feature-flags.git
```

Please note that `react-feature-flags` requires `react@^16.8.0` as a peer dependency.

## Examples

### Basic Usage

```jsx
import { FeatureFlagProvider, FeatureFlagWidget } from 'react-feature-flags';

const FEATURE_FLAG_URL = 'https://localhost:3000/feature-flags';

export default function App() {
  return (
    <FeatureFlagProvider url={FEATURE_FLAG_URL}>
      ...
      <FeatureFlagWidget name="feature-one">
        ...
      </FeatureFlagWidget>
      <FeatureFlagWidget name="feature-two">
        ...
      </FeatureFlagWidget>
    </form>
  );
}
```

### Hooks Usage

```jsx
import { FeatureFlagProvider, useFeatureFlag } from 'react-feature-flags';

const FEATURE_FLAG_URL = 'https://localhost:3000/feature-flags';

const FeatureOne = () => {
  const featureFlag = useFeatureFlag();

  return featureFlag.has('feature-one') && (
    <div>...</div>
  );
};

const FeatureTwo = () => {
  const featureFlag = useFeatureFlag();

  return featureFlag.has('feature-two') && (
    <div>...</div>
  );
};

export default function App() {
  return (
    <FeatureFlagProvider url={FEATURE_FLAG_URL}>
      ...
      <FeatureOne />
      <FeatureTwo />
    </form>
  );
}
```

## License

MIT
