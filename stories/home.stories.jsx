/* eslint-disable react/no-multi-comp */
import './home.sass'

import { Block } from 'bemboo'
import React from 'react'

import { storiesOf } from '@storybook/react'
import SyntaxHighlighter, {
  registerLanguage,
} from 'react-syntax-highlighter/prism-light'
import jsx from 'react-syntax-highlighter/languages/prism/jsx'
import prism from 'react-syntax-highlighter/styles/prism/prism'

import Formol, { Conditional, Field, Inliner } from '../src'
import pkg from '../package.json'

registerLanguage('jsx', jsx)

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
}

const Exemple2 = () => (
  <Formol
    item={item}
    validator={({ firstname, lastname }) => ({
      firstname:
        (firstname ? firstname.length : 0) + (lastname ? lastname.length : 0) <=
        6
          ? 'Your fullname must be greater than 6 characters.'
          : null,
    })}
    // eslint-disable-next-line no-alert
    onSubmit={item_ => alert(JSON.stringify(item_, null, 2))}
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
        'Antartica',
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
        type="checkbox"
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
        disabled
        readOnly
      >
        Indicative price
      </Field>
    </Conditional>
    <Field
      name="color"
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
      Choose some colors
    </Field>
  </Formol>
)

const b = new Block('Home')
storiesOf('Home', module).add('Home', () => (
  <section className={b}>
    <h1 className={b.e('hero')}>
      Formol <small className={b.e('version')}>{pkg.version}</small>
    </h1>
    <article className={b.e('highlights')}>
      Formol is a full featured object edition oriented form framework for
      React.
      <ul>
        <li>Native field types</li>
        <li>
          Powerful non-native field types, based on well known libraries:
          <ul>
            <li>
              <a href="https://jpuri.github.io/react-draft-wysiwyg">
                react-draft-wysiwyg
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
      </ul>
    </article>
    <article className={b.e('quick-start')}>
      <h2>Quick start</h2>
      <SyntaxHighlighter language="jsx" style={prism}>
        yarn install formol
      </SyntaxHighlighter>
      <p>
        (Optional but very recommended) Enable code-splitting with webpack by
        adding to your jsx babel rule in your webpack.config.js:
      </p>
      <SyntaxHighlighter language="jsx" style={prism}>
        include: &quot;node_modules/formol&quot;
      </SyntaxHighlighter>
      <p>
        Now you are all set. Next you can browse this storybook to find most
        formol features illustrated with state interaction (state tab),
        attribute live editting (knobs tab) and source code (story tab) on the
        right panel.
      </p>
      <p>
        But before going too deep, let’s take a look at the two following
        exemples:
      </p>
    </article>
    <article className={b.e('exemple')}>
      <h3>Formol is a simple and elegant form library for React.</h3>
      <div className={b.e('side-by-side')}>
        <SyntaxHighlighter language="jsx" style={prism}>
          {dedent`
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
      <h3>Yet it is quite a powerful one</h3>
      <div className={b.e('side-by-side')}>
        <SyntaxHighlighter language="jsx" style={prism}>
          {dedent`
          <Formol
            item={item}
            validator={({ firstname, lastname }) => ({
              firstname:
                (firstname ? firstname.length : 0) +
                (lastname ? lastname.length : 0) <= 6
                  ? 'Your fullname must be greater than 6 characters.'
                  : null,
            })}
            // eslint-disable-next-line no-alert
            onSubmit={item_ => alert(JSON.stringify(item_, null, 2))}
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
                'Antartica',
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
                type="checkbox"
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
                  'This price equals the number of letters in this form ' +
                  '(because why not)'
                }
                disabled
                readOnly
              >
                Indicative price
              </Field>
            </Conditional>
            <Field
              name="color"
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
    <a href="https://github.com/Kozea/formol/">
      <img
        style={{ position: 'absolute', top: 0, right: 0, border: 0 }}
        src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"
        alt="Fork me on GitHub"
      />
    </a>
  </section>
))
