# formol

[![Coverage Status](https://coveralls.io/repos/github/Kozea/formol/badge.svg?branch=master)](https://coveralls.io/github/Kozea/formol?branch=master)

An opiniated react form framework.

## [Check the storybook](https://Kozea.github.io/formol/)

Formol is a full featured object edition form framework for React.

*   Native field types
*   Powerful non-native field types, based on well known libraries:
    *   [react-quill](https://zenoamaro.github.io/react-quill/)
    *   [react-select](https://react-select.com)
    *   [react-dropzone](https://react-dropzone.netlify.com)
*   Enhanced native dom validation with cross field validation support
*   Dynamic forms with dynamic field attributes based on fields values
*   Lightweight (20kb gz) with webpack code-splitting (total: ~600kb gz)
*   Support style theming (with currently two bundled)
*   Works well with [unrest](https://kozea.github.io/unrest/) and [redux-api-unrest](https://github.com/Kozea/redux-api-unrest)

Quick start
-----------

    yarn add formol

To use webpack code-splitting in formol, you will have to do these modifications to your webpack.config:

    module: {
      rules: [
        {
          test: /\.(mjs|jsx?)$/,
          exclude: /node_modules\/(?!(formol)\/).*/, // <- this line allows formol
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
    },

NB: It is also possible to use the prebuilt version of formol, in this case you will have to copy the javascript files in node\_modules/formol/lib in your output.path instead of modifying your webpack config.

Now you are all set.

But before going too deep, let’s take a look at the two following exemples:

### Simple and elegant

    import 'formol/lib/default.css'
    import Formol, {Field} from 'formol'
    
    const onSubmit = ({ login, password }) =>
      doLogin(login, password)
    
    <Formol onSubmit={onSubmit}>
      <Field>Login</Field>
      <Field type="password-strength">Password</Field>
    </Formol>
    

### Powerful

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
          ([k, v]) => [`<div style="color: ${v};">${k}</div>`, v]
        )}
        dangerousRawHTMLLabels
      >
        Choose some colors
      </Field>
    </Formol>
    
### Themable

The default theme is accessible by a simple css import (you will need the standard: [css loader](https://github.com/webpack-contrib/css-loader)):

    import 'formol/lib/default.css'

similarly with the clean theme:

    import 'formol/lib/clean.css'

You can also use directly the sass import if you are using [sass](https://sass-lang.com/):

    @import ~formol/src/sass/default

with the added benefit that you can override [the formol variables](https://github.com/Kozea/formol/blob/master/src/sass/default/_variables.sass):

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
    
## Publish a new release

1. Merge the branches (features, fixes) into master
2. Create release commit:
    1. Update `version` in package.json according to [semantic versioning rules](https://semver.org/)
    2. Update `CHANGELOG.md` (manually)
    3. Commit these changes as version bump, e.g. `v3.0.0`
    4. Push commit onto master
3. Tag version bump commit e.g. `git tag v3.0.0` and push it `git push --tags`
4. `yarn prepublish`
5. `npm publish` (requires being an npm package maintainer)
6. `yarn storybook-deploy`
