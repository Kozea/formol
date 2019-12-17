/* eslint-disable react/no-multi-comp */
import './home.sass'

import { Block } from 'bemboo'
import React from 'react'
import { storiesOf } from '@storybook/react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import sass from 'react-syntax-highlighter/dist/esm/languages/prism/sass'
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism'

import Formol, { Conditional, Field, Inliner } from '../src'
import pkg from '../package.json'

SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('sass', sass)

const dedent = (strs, ...values) => {
  const str = strs
    .reduce((s, part, i) => s + values[i - 1] + part)
    .replace(/^\n/, '')
  const level = str.length - str.replace(/^ +/, '').length
  return str
    .split('\n')
    .map(line => line.slice(level))
    .join('\n')
}

const Exemple1 = () => (
  <Formol
    onSubmit={({ login, password }) =>
      // eslint-disable-next-line no-alert
      alert(
        'doLogin called with:\n' +
          `  login    = "${login}",\n` +
          `  password = "${password}"`
      )
    }
  >
    <Field>Login</Field>
    <Field type="password-strength">Password</Field>
  </Formol>
)

const item = {
  firstname: 'John',
  lastname: 'Doe',
  birth: '1988-04-12',
  address: {
    zip: '82937',
    city: 'Los Angeles',
    continent: 'North America',
  },
  fastShipping: true,
  colors: ['#00ffff', '#008000'],
}

const Exemple2 = () => (
  <Formol
    item={item}
    validator={({ firstname, lastname }) => ({
      firstname:
        (firstname ? firstname.length : 0) + (lastname ? lastname.length : 0) <=
        6
          ? 'Your full name must be greater than 6 characters.'
          : null,
    })}
    // eslint-disable-next-line no-alert
    onSubmit={item_ => alert(JSON.stringify(item_, null, 2))}
    submitText="Show me the new item"
  >
    <Field name="firstname" required>
      First Name
    </Field>
    <Field name="lastname" required minLength={3}>
      Last Name
    </Field>
    <Field
      name="birth"
      type="calendar"
      validator={v =>
        new Date(v) < new Date('1950-01-01') ? 'You can’t be too old' : ''
      }
    >
      Day of birth
    </Field>
    <Inliner>
      <Field name="address.zip" size={5}>
        Zip code
      </Field>
      <Conditional readOnly={({ address: { zip } }) => !zip}>
        <Field name="address.city">City</Field>
      </Conditional>
    </Inliner>
    <Field
      name="address.continent"
      type="select-menu"
      choices={[
        'Africa',
        'Antarctica',
        'Asia',
        'Europe',
        'North America',
        'Australia/Oceania',
        'South America',
      ]}
    >
      Continent
    </Field>
    <Conditional
      show={({ address: { continent } }) =>
        ['Asia', 'North America', 'South America'].includes(continent)
      }
    >
      <Field
        name="fastShipping"
        type="switch"
        title="Fast shipping includes an extra cost"
      >
        Fast shipping
      </Field>
    </Conditional>
    <Conditional
      value={({ firstname, lastname, address: { zip, city, continent } }) =>
        (firstname ? firstname.length : 0) +
        (lastname ? lastname.length : 0) +
        (zip ? zip.length : 0) +
        (city ? city.length : 0) +
        (continent ? continent.length : 0)
      }
    >
      <Field
        name="price"
        type="money"
        title={
          'This price equals the number of letters in this form ' +
          '(because why not)'
        }
        max={100}
        disabled
        readOnly
      >
        Indicative price
      </Field>
    </Conditional>
    <Field
      name="colors"
      type="checkbox-set"
      choices={Object.entries({
        Red: '#ff0000',
        Yellow: '#ffff00',
        Olive: '#808000',
        Lime: '#00ff00',
        Green: '#008000',
        Aqua: '#00ffff',
        Teal: '#008080',
        Blue: '#0000ff',
        Navy: '#000080',
        Fuchsia: '#ff00ff',
        Purple: '#800080',
      }).map(([k, v]) => [`<div style="color: ${v};">${k}</div>`, v])}
      dangerousRawHTMLLabels
    >
      Choose your colors
    </Field>
  </Formol>
)

const b = new Block('Home')
storiesOf('Home', module)
  .addParameters({ options: { showPanel: false } })
  .add('Home', () => (
    <section className={b}>
      <h1 className={b.e('hero')}>
        Formol <small className={b.e('version')}>{pkg.version}</small>
      </h1>
      <article className={b.e('highlights')}>
        Formol is a full featured object edition form framework for React.
        <ul>
          <li>Native field types</li>
          <li>
            Powerful non-native field types, based on well known libraries:
            <ul>
              <li>
                <a href="https://zenoamaro.github.io/react-quill/">
                  react-quill
                </a>
              </li>
              <li>
                <a href="https://react-select.com">react-select</a>
              </li>
              <li>
                <a href="https://react-dropzone.netlify.com">react-dropzone</a>
              </li>
            </ul>
          </li>
          <li>
            Enhanced native dom validation with cross field validation support
          </li>
          <li>
            Dynamic forms with dynamic field attributes based on fields values
          </li>
          <li>
            Lightweight (20kb gz) with webpack code-splitting (total: ~600kb gz)
          </li>
          <li>Support style theming (with currently two bundled)</li>
          <li>
            Works well with <a href="https://kozea.github.io/unrest/">unrest</a>{' '}
            and{' '}
            <a href="https://github.com/Kozea/redux-api-unrest">
              redux-api-unrest
            </a>
          </li>
          <li>
            <a href="https://coveralls.io/github/paradoxxxzero/formol">
              100% test coverage
            </a>
          </li>
        </ul>
      </article>
      <article className={b.e('quick-start')}>
        <h2>Quick start</h2>
        <SyntaxHighlighter language="jsx" style={prism}>
          yarn add formol
        </SyntaxHighlighter>
        <p>
          To use webpack code-splitting in formol, you will have to do these
          modifications to your webpack.config:
        </p>
        <SyntaxHighlighter language="jsx" style={prism}>
          {dedent`
            module: {
              rules: [
                {
                  test: /\\.(mjs|jsx?)$/,
                  exclude: /node_modules\\/(?!(formol)\\/).*/, // <- this line allows formol
                  use: {                                     //    to be built alongside
                    loader: 'babel-loader',                  //    your project
                  },
                  options: {
                    presets: [
                      '@babel/preset-react',
                      [
                        '@babel/preset-env',
                        {
                          targets: { browsers: 'last 1 version and > 3%' },
                          modules: false,
                        },
                      ],
                    ],
                    plugins: [ // <- these plugins are needed to build formol
                      '@babel/plugin-syntax-dynamic-import',
                      ['@babel/plugin-proposal-decorators', { legacy: true }],
                      'add-react-static-displayname',
                      ['@babel/plugin-proposal-class-properties', { loose: true }],
                    ],
                  },
                },
              ],
            },
            resolve: { // <- these extensions needed to be loaded by webpack
              extensions: ['.mjs', '.js', '.jsx'],
            },`}
        </SyntaxHighlighter>
        <p>
          See the{' '}
          <a
            href="https://github.com/Kozea/formol_starter_pack"
            target="_blank"
            rel="noopener noreferrer"
          >
            starter pack
          </a>{' '}
          for more information
        </p>
        <aside className={b.e('nb')}>
          NB: It is also possible to use the prebuilt version of formol, in this
          case you will have to copy the javascript files in
          node_modules/formol/lib in your output.path instead of modifying your
          webpack config.
        </aside>
        <p>
          Now you are all set. Next you can browse this storybook to find most
          formol features illustrated with state interaction (state tab),
          attribute live editing (knobs tab) and source code (story tab) on the
          right panel.
        </p>
        <p>
          But before going too deep, let’s take a look at the two following
          exemples:
        </p>
      </article>
      <article className={b.e('exemple')}>
        <h3>Simple and elegant</h3>
        <div className={b.e('side-by-side')}>
          <SyntaxHighlighter language="jsx" style={prism}>
            {dedent`
          import 'formol/lib/default.css'
          import Formol, {Field} from 'formol'

          const onSubmit = ({ login, password }) =>
            doLogin(login, password)

          <Formol onSubmit={onSubmit}>
            <Field>Login</Field>
            <Field type="password-strength">Password</Field>
          </Formol>
        `}
          </SyntaxHighlighter>
          <Exemple1 />
        </div>
      </article>
      <article className={b.e('exemple')}>
        <h3>Powerful</h3>
        <div className={b.e('side-by-side')}>
          <SyntaxHighlighter language="jsx" style={prism}>
            {dedent`
          const item = {
            firstname: 'John',
            lastname: 'Doe',
            birth: '1988-04-12',
            address: {
              zip: '82937',
              city: 'Los Angeles',
              continent: 'North America',
            },
            fastShipping: true,
            colors: ['#00ffff', '#008000'],
          }

          <Formol
            item={item}
            validator={({ firstname, lastname }) => ({
              firstname:
                (firstname ? firstname.length : 0) +
                (lastname ? lastname.length : 0) <= 6
                  ? 'Your full name must be greater than 6 characters.'
                  : null,
            })}
            // eslint-disable-next-line no-alert
            onSubmit={item_ => alert(JSON.stringify(item_, null, 2))}
            submitText="Show me the new item"
          >
            <Field name="firstname" required>
              First Name
            </Field>
            <Field name="lastname" required minLength={3}>
              Last Name
            </Field>
            <Field
              name="birth"
              type="calendar"
              validator={v =>
                new Date(v) < new Date('1950-01-01')
                  ? 'You can’t be too old'
                  : ''
              }
            >
              Day of birth
            </Field>
            <Inliner>
              <Field name="address.zip" size={5}>
                Zip code
              </Field>
              <Conditional readOnly={({ address: { zip } }) => !zip}>
                <Field name="address.city">City</Field>
              </Conditional>
            </Inliner>
            <Field
              name="address.continent"
              type="select-menu"
              choices={[
                'Africa',
                'Antarctica',
                'Asia',
                'Europe',
                'North America',
                'Australia/Oceania',
                'South America',
              ]}
            >
              Continent
            </Field>
            <Conditional
              show={({ address: { continent } }) =>
                [
                  'Asia', 'North America', 'South America'
                ].includes(continent)
              }
            >
              <Field
                name="fastShipping"
                type="switch"
                title="Fast shipping includes an extra cost"
              >
                Fast shipping
              </Field>
            </Conditional>
            <Conditional
              value={({
                  firstname,
                  lastname,
                  address: { zip, city, continent }
              }) =>
                (firstname ? firstname.length : 0) +
                (lastname ? lastname.length : 0) +
                (zip ? zip.length : 0) +
                (city ? city.length : 0) +
                (continent ? continent.length : 0)
              }
            >
              <Field
                name="price"
                type="money"
                title={
                  'This price equals the number of letters ' +
                  'in this form (because why not)'
                }
                max={100}
                disabled
                readOnly
              >
                Indicative price
              </Field>
            </Conditional>
            <Field
              name="colors"
              type="checkbox-set"
              choices={Object.entries({
                Red: '#ff0000',
                Yellow: '#ffff00',
                Olive: '#808000',
                Lime: '#00ff00',
                Green: '#008000',
                Aqua: '#00ffff',
                Teal: '#008080',
                Blue: '#0000ff',
                Navy: '#000080',
                Fuchsia: '#ff00ff',
                Purple: '#800080',
              }).map(
                ([k, v]) => [${'`<div style="color: ${v};">${k}</div>`'}, v]
              )}
              dangerousRawHTMLLabels
            >
              Choose some colors
            </Field>
          </Formol>
        `}
          </SyntaxHighlighter>
          <Exemple2 />
        </div>
      </article>
      <article className={b.e('exemple')}>
        <h3>Themable</h3>
        <p>
          The default theme is accessible by a simple css import (you will need
          the standard:{' '}
          <a
            href="https://github.com/webpack-contrib/css-loader"
            rel="noopener noreferrer"
            target="_blank"
          >
            css loader
          </a>
          ):
          <SyntaxHighlighter language="jsx" style={prism}>
            {"import 'formol/lib/default.css'"}
          </SyntaxHighlighter>
        </p>
        <p>
          similarly with the clean theme:
          <SyntaxHighlighter language="jsx" style={prism}>
            {"import 'formol/lib/clean.css'"}
          </SyntaxHighlighter>
        </p>
        <p>
          You can also use directly the sass import if you are using{' '}
          <a
            href="https://sass-lang.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            sass
          </a>
          :
          <SyntaxHighlighter language="sass" style={prism}>
            {'@import ~formol/src/sass/default'}
          </SyntaxHighlighter>
          with the added benefit that you can override{' '}
          <a
            href={
              'https://github.com/paradoxxxzero/formol/blob/master/' +
              'src/sass/default/_variables.sass'
            }
            rel="noopener noreferrer"
            target="_blank"
          >
            the formol variables
          </a>
          :
          <SyntaxHighlighter language="sass" style={prism}>
            {dedent`
            $formol-color: #ce93d8
            $formol-color-action: #ba68c8
            $formol-color-inactive: #e1bee7
            $formol-color-error: #f06292
            $formol-background-color: #f3e5f5

            $formol-font-size: 0.9em

            $formol-big-field-size: 70em
            $formol-medium-field-size: 50em

            $formol-field-margin: 2em
            $formol-field-padding: 1.5em

            @import ~formol/src/sass/default
          `}
          </SyntaxHighlighter>
          <small>(This is just an exemple please don’t judge me).</small>
        </p>
        <p>
          As a side note if you have some design skills, you are very welcome to
          add new themes by submitting a{' '}
          <a
            href="https://github.com/paradoxxxzero/formol/pulls"
            rel="noopener noreferrer"
            target="_blank"
          >
            pull request
          </a>{' '}
          with your new theme in the{' '}
          <a
            href="https://github.com/paradoxxxzero/formol/blob/master/src/sass/"
            rel="noopener noreferrer"
            target="_blank"
          >
            sass directory
          </a>
          .
        </p>
        <p>
          The sass is written in a BEM style thanks to{' '}
          <a
            href="https://github.com/paradoxxxzero/bemboo"
            rel="noopener noreferrer"
            target="_blank"
          >
            bemboo
          </a>
          .
        </p>
      </article>
      <a href="https://github.com/paradoxxxzero/formol/">
        <img
          style={{ position: 'absolute', top: 0, right: 0, border: 0 }}
          src={
            'https://s3.amazonaws.com/github/ribbons/' +
            'forkme_right_gray_6d6d6d.png'
          }
          alt="Fork me on GitHub"
        />
      </a>
    </section>
  ))
