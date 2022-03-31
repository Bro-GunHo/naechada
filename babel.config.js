module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@appConfig': './src/config/config',
          '@reduxAction': './src/redux/actions',
          '@component': './src/component',
          '@img': './src/img',
        },
      },
    ],
    ['react-native-reanimated/plugin'],
  ],
};
