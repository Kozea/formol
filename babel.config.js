module.exports = function (api) {
  api.cache(true)

  const presets = ['@babel/preset-react', '@babel/preset-env']
  const plugins = [
    'dynamic-import-node',
    '@babel/plugin-proposal-object-rest-spread',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-transform-runtime',
  ]

  return {
    presets,
    plugins,
  }
}
