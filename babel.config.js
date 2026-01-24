module.exports = function (api) {
  api.cache(true);

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@hooks': './src/hooks',
            '@services': './src/services',
            '@navigation': './src/navigation',
            '@config': './src/config',
            '@theme': './src/theme',
            '@providers': './src/providers',
            '@utils': './src/utils',
          },
        },
      ],
    ],
  };
};
