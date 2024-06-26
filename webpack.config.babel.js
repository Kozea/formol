import fs from 'fs'
import path from 'path'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import config from './package.json'

export default {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    formol: ['./src'],
    ...fs
      .readdirSync(path.join(__dirname, 'src', 'sass'))
      .reduce((themes, theme) => {
        if (theme.endsWith('.sass')) {
          themes[theme.slice(0, -5)] = path.join(
            __dirname,
            'src',
            'sass',
            theme
          )
        }
        return themes
      }, {}),
  },
  output: {
    path: path.join(__dirname, 'lib'),
    publicPath: 'assets/formol/',
    filename: '[name].js',
    library: 'formol',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  externals: Object.keys(config.peerDependencies),
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      logLevel: 'error',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          babelrc: false,
          presets: [
            '@babel/preset-react',
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: ['defaults'],
                },
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
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.sass$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.join(__dirname, 'src')],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx'],
  },
}
