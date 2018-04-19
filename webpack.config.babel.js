import path from 'path'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

export default {
  mode: 'development' || 'production',
  entry: ['./src/index'],
  output: {
    path: path.join(__dirname, 'lib'),
    publicPath: 'assets/formol/',
    filename: 'formol.js',
    library: 'formol',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  externals: [
    'date-fns',
    'react',
    'react-dom',
    'react-dropzone',
    'react-icons',
  ],
  plugins: [
    new MiniCssExtractPlugin({ filename: 'formol.css' }),
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
                targets: ['> 3% in FR', 'last 2 versions', 'not ie <= 10'],
                modules: false,
              },
            ],
          ],
          plugins: [
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-decorators',
            'add-react-static-displayname',
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            '@babel/plugin-transform-classes',
          ].filter(_ => _),
        },
      },
      {
        test: /\.css$/,
        loader: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.sass$/,
        loader: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.join(__dirname, 'src')],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}
