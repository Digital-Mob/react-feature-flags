import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const common = {
  external: [
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescript(),
    terser(),
  ],
};

export default [
  {
    input: 'src/index.tsx',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'es',
      },
    ],
    ...common,
  },
  {
    input: 'src/hooks.tsx',
    output: [
      {
        file: pkg.main.replace(/index/, 'hooks'),
        format: 'cjs',
      },
      {
        file: pkg.module.replace(/index/, 'hooks'),
        format: 'es',
      },
    ],
    ...common,
  }
];
