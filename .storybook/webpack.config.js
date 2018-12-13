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
  // HTMLWebpackPlugin: Prevent themes to be added in the html
  baseConfig.plugins[0].options.excludeChunks.push(...themes)
  // Extract themes as css files
  baseConfig.plugins.push(new MiniCssExtractPlugin({ filename: '[name].css' }))
  return baseConfig
}
