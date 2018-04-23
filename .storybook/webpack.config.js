const path = require('path')

module.exports = (baseConfig, env) => {
  const src = path.join(__dirname, '..', 'src')
  baseConfig.entry.preview.unshift('regenerator-runtime/runtime.js')
  baseConfig.module.rules.push(
    // {
    //   test: /\.jsx?$/,
    //   include: src,
    //   loader: 'babel-loader',
    //   options: {
    //     cacheDirectory: true,
    //     babelrc: false,
    //     presets: [
    //       '@babel/preset-react',
    //       [
    //         '@babel/preset-env',
    //         {
    //           targets: ['> 3% in FR', 'last 2 versions', 'not ie <= 10'],
    //           modules: false,
    //         },
    //       ],
    //     ],
    //     plugins: [
    //       '@babel/plugin-proposal-export-default-from',
    //       '@babel/plugin-syntax-dynamic-import',
    //       '@babel/plugin-proposal-object-rest-spread',
    //       '@babel/plugin-proposal-decorators',
    //       'add-react-static-displayname',
    //       ['@babel/plugin-proposal-class-properties', { loose: true }],
    //       '@babel/plugin-transform-classes',
    //     ],
    //   },
    // },
    {
      test: /\.css$/,
      loader: ['css-loader'],
    },
    {
      test: /\.sass$/,
      loader: [
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            includePaths: [src],
          },
        },
      ],
    },
  )

  return baseConfig
}
