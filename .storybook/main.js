const config = {
  // Required
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  // Optional
  // docs: {
  //   autodocs: 'tag',
  // },
  // staticDirs: ['../public'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-storysource',
    '@storybook/addon-knobs',
    '@storybook/addon-webpack5-compiler-babel',
  ],

  docs: {
    autodocs: true,
  },
}
export default config
