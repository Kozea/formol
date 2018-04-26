const path = require('path')

const rootDir = path.join(__dirname, '..')
const dir = pth => (pth ? path.join(rootDir, pth) : rootDir)

module.exports = (baseConfig, env) => {
  baseConfig.entry.preview.unshift('regenerator-runtime/runtime.js')
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
            targets: ['> 3% in FR', 'last 2 versions', 'not ie <= 10'],
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
        'style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            includePaths: [dir('src')],
          },
        },
      ],
    }
  )

  return baseConfig
}
