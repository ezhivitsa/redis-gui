const developmentEnvironments = ['development', 'test'];

const developmentPlugins = ['react-hot-loader/babel'];

module.exports = (api) => {
  // See docs about api at https://babeljs.io/docs/en/config-files#apicache

  const development = api.env(developmentEnvironments);

  return {
    presets: [
      // @babel/preset-env will automatically target our browserslist targets
      [
        require('@babel/preset-env'),
        {
          useBuiltIns: 'usage',
          corejs: '3',
        },
      ],
      require('@babel/preset-typescript'),
      [require('@babel/preset-react'), { development }],
    ],
    plugins: [
      // Stage 1
      [require('@babel/plugin-proposal-optional-chaining'), { loose: false }],
      [require('@babel/plugin-proposal-nullish-coalescing-operator'), { loose: false }],

      // Stage 2
      [require('@babel/plugin-proposal-decorators'), { legacy: true }],
      require('@babel/plugin-proposal-numeric-separator'),

      // Stage 3
      [require('@babel/plugin-proposal-class-properties'), { loose: false }],

      ...(development ? developmentPlugins : []),
    ],
  };
};
