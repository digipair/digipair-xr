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
        entries: Object.getOwnPropertyNames(tsconfig.compilerOptions.paths).map(
          (property) => ({
            find: property,
            replacement: path.resolve(
              tsconfig.compilerOptions.paths[property][0],
            ),
          }),
        ),
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
