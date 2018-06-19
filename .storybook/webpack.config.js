const fs = require('fs')
const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const rootDir = path.join(__dirname, '..')
const dir = pth => (pth ? path.join(rootDir, pth) : rootDir)

module.exports = (baseConfig, env) => {
  baseConfig.entry.preview.unshift('regenerator-runtime/runtime.js')
  fs
    .readdirSync(path.join(rootDir, 'src', 'sass'))
    .map(
      theme =>
        (baseConfig.entry[theme] = path.join(
          rootDir,
          'src',
          'sass',
          theme,
          'base.sass'
        ))
    )
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
            targets: { browsers: ['> 3%', 'last 2 versions', 'not ie <= 10'] },
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
