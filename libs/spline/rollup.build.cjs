const tsconfig = require('../../tsconfig.base.json');
const alias = require('@rollup/plugin-alias');
const path = require('path');

function getRollupOptions(options) {
  const extraGlobals = {};
  const externals =
    options.output.format === 'cjs' ? ['@digipair-xr/core'] : [];

  const value = {
    ...options,
    external: (name) => {
      return externals.includes(name);
    },
    plugins: [
      ...options.plugins,
      alias({
        entries: [
          {
            find: 'three/examples/jsm/loaders/DRACOLoader.js',
            replacement: 'libs/spline/src/lib/vendors/DRACOLoader.js',
          },
          {
            find: 'three/examples/jsm/utils/BufferGeometryUtils.js',
            replacement: 'libs/spline/src/lib/vendors/BufferGeometryUtils.js',
          },
          {
            find: 'three',
            replacement: 'libs/spline/src/lib/vendors/three.js',
          },
          ...Object.getOwnPropertyNames(tsconfig.compilerOptions.paths).map(
            (property) => ({
              find: property,
              replacement: path.resolve(
                tsconfig.compilerOptions.paths[property][0],
              ),
            }),
          ),
        ],
      }),
    ],
    output: {
      ...options.output,
      globals: extraGlobals,
      plugins: [],
    },
  };

  return value;
}

module.exports = getRollupOptions;
