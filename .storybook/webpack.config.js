const fs = require('fs')
const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const rootDir = path.join(__dirname, '..')
const dir = (pth) => (pth ? path.join(rootDir, pth) : rootDir)

module.exports = ({ config }) => {
  // Add themes as entries to compile them as css
  config.entry = { main: config.entry }
  const themes = fs
    .readdirSync(path.join(rootDir, 'src', 'sass'))
    .filter((theme) => theme.endsWith('.sass'))
    .map((theme) => {
      const themeName = theme.slice(0, -5)
      config.entry[themeName] = path.join(rootDir, 'src', 'sass', theme)
      return themeName
    })

  config.module.rules[0] = {
    test: /\.(mjs|jsx?)$/,
    include: dir(),
    exclude: dir('node_modules'),
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      babelrc: false,
      presets: [
        '@babel/preset-react',
        [
          '@babel/preset-env',
          {
            targets: { browsers: ['defaults'] },
            modules: false,
          },
        ],
      ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-object-rest-spread',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        'add-react-static-displayname',
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        '@babel/plugin-transform-runtime',
      ],
    },
  }

  config.module.rules.push({
    test: /\.mdx?$/,
    use: [
      // Note that Webpack runs right-to-left: `@mdx-js/loader` is used first, then
      // `babel-loader`.
      { loader: 'babel-loader', options: {} },
      {
        loader: '@mdx-js/loader',
        /** @type {import('@mdx-js/loader').Options} */
        options: {},
      },
    ],
  })

  // Add styles loaders (and the storysource hack)
  config.module.rules.push(
    {
      test: /\.sass$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            sassOptions: {
              includePaths: [dir('src')],
            },
          },
        },
      ],
    }
    // },
    // {
    //   test: /\.stories\.jsx?$/,
    //   loaders: [require.resolve('@storybook/addon-storysource/loader')],
    //   enforce: 'pre',
    // }
  )

  // Extract themes as css files
  config.plugins.push(new MiniCssExtractPlugin({ filename: '[name].css' }))
  return config
}
