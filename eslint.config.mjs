import js from '@eslint/js'
import react from 'eslint-plugin-react'
import _import from 'eslint-plugin-import'
import { fixupPluginRules } from '@eslint/compat'
import globals from 'globals'
import babelParser from '@babel/eslint-parser'
import util from 'node:util'

if (!util.styleText) {
  util.styleText = (style, text) => text
}

const mapGlobals = (globals) =>
  Object.fromEntries(
    Object.entries(globals).map(([key, value]) => [
      key,
      value === true ? 'writable' : 'readonly',
    ])
  )

const babelParserCompat = {
  ...babelParser,
  parseForESLint(...args) {
    const result = babelParser.parseForESLint(...args)
    if (result.scopeManager && !result.scopeManager.addGlobals) {
      result.scopeManager.addGlobals = function (globals) {
        const globalScope = this.scopes[0]
        const list = Array.isArray(globals) ? globals : Object.keys(globals)
        list.forEach((name) => {
          let variable = globalScope.set.get(name)
          if (!variable) {
            variable = {
              name,
              scope: globalScope,
              defs: [],
              identifiers: [],
              references: [],
              descendants: [],
              eslintImplicitGlobalSetting: 'readonly',
              eslintExplicitGlobal: false,
            }
            globalScope.set.set(name, variable)
            globalScope.variables.push(variable)
          }

          // Resolve references in globalScope.through
          for (let i = 0; i < globalScope.through.length; i++) {
            const ref = globalScope.through[i]
            if (ref.identifier.name === name) {
              ref.resolved = variable
              variable.references.push(ref)
              globalScope.through.splice(i, 1)
              i--
            }
          }
        })
      }
    }
    return result
  },
}

export default [
  {
    ignores: ['**/node_modules/', 'lib/', 'coverage/', 'demos/dist/'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    plugins: {
      react: fixupPluginRules(react),
      import: fixupPluginRules(_import),
    },
    languageOptions: {
      parser: babelParserCompat,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react', '@babel/preset-env'],
          plugins: [
            '@babel/plugin-proposal-object-rest-spread',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            '@babel/plugin-transform-runtime',
          ],
        },
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...mapGlobals(globals.browser),
        ...mapGlobals(globals.node),
        ...mapGlobals(globals.jest),
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx'],
        },
      },
    },
    rules: {
      // Formatting & Basics
      quotes: ['warn', 'single', { avoidEscape: true }],
      semi: ['error', 'never'],
      'no-unused-vars': ['error', { ignoreRestSiblings: true }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'object-curly-spacing': ['error', 'always'],
      'no-prototype-builtins': 'off',

      // React
      'react/prop-types': 'off',
      'react/no-array-index-key': 'error',
      'react/jsx-pascal-case': ['error', { ignore: ['_'] }],
      'react/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'error',

      // Import
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['builtin', 'external', ['parent', 'sibling', 'index']],
        },
      ],
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'error',
      'import/named': 'error',
    },
  },
]
