module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'mjs', 'json'],
  modulePaths: ['<rootDir>/src'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '\\.(css|sass)$': '<rootDir>/test/styleMock.js',
  },
  setupFiles: ['<rootDir>/test/setup.js'],
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/i18n/*'],
  testURL: 'http://localhost/',
  transformIgnorePatterns: [
    'node_modules/(?!(react-syntax-highlighter|date-fns))',
  ],
}
