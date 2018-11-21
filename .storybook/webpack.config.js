const fs = require('fs')
const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const rootDir = path.join(__dirname, '..')
const dir = pth => (pth ? path.join(rootDir, pth) : rootDir)

module.exports = (baseConfig, env) => {
  const themes = fs
    .readdirSync(path.join(rootDir, 'src', 'sass'))
    .map(
      theme =>
        theme.endsWith('.sass') &&
        (baseConfig.entry[theme.slice(0, -5)] = path.join(
          rootDir,
          'src',
          'sass',
          theme
        )) &&
        theme.slice(0, -5)
    )
    .filter(t => t)

  // Patching the new Generate Page Webpack Plugin to re-add the styles.
  const oldHead = baseConfig.plugins[0].options.headHtmlSnippet
  baseConfig.plugins[0].options.headHtmlSnippet = entry =>
    (oldHead(entry) || '') +
      (entry === 'iframe'
        ? themes
            .map(theme => `<link href="${theme}.css" rel="stylesheet">`)
            .join('\n')
        : '') || null

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
      ],
    },
  }
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

  baseConfig.plugins.push(new MiniCssExtractPlugin({ filename: '[name].css' }))
  baseConfig.resolve.extensions = ['.js', '.jsx', '.json']
  return baseConfig
}
