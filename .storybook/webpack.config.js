const fs = require('fs')
const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const rootDir = path.join(__dirname, '..')
const dir = pth => (pth ? path.join(rootDir, pth) : rootDir)

module.exports = (baseConfig, env) => {
  // Add themes as entries to compile them as css
  baseConfig.entry = { main: baseConfig.entry }
  const themes = fs
    .readdirSync(path.join(rootDir, 'src', 'sass'))
    .filter(theme => theme.endsWith('.sass'))
    .map(theme => {
      const themeName = theme.slice(0, -5)
      baseConfig.entry[themeName] = path.join(rootDir, 'src', 'sass', theme)
      return themeName
    })

  baseConfig.module.rules[0] = {
    test: /\.jsx?$/,
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
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-object-rest-spread',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        'add-react-static-displayname',
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        '@babel/plugin-transform-runtime',
      ],
    },
  }
  // Add styles loaders (and the storysource hack)
  baseConfig.module.rules.push(
    {
      test: /\.css$/,
      loader: ['style-loader', 'css-loader'],
    },
    {
      test: /\.sass$/,
      loader: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            includePaths: [dir('src')],
          },
        },
      ],
    },
    {
      test: /\.stories\.jsx?$/,
      loaders: [require.resolve('@storybook/addon-storysource/loader')],
      enforce: 'pre',
    }
  )

  // Extract themes as css files
  baseConfig.plugins.push(new MiniCssExtractPlugin({ filename: '[name].css' }))
  return baseConfig
}
