### [2.10.0](https://github.com/Kozea/formol/compare/v2.9.6...v2.10.0)

- Use `accent-color` to style radio buttons and checkboxes

### [2.9.6](https://github.com/Kozea/formol/compare/v2.9.5...v2.9.6)

- Fix storybook

### [2.9.5](https://github.com/Kozea/formol/compare/v2.9.4...v2.9.5)

- Remove special character `obj`

### [2.9.4](https://github.com/Kozea/formol/compare/v2.9.3...v2.9.4)

- Make `Datefield` component accept other `react-datepicker` props

### [2.9.3](https://github.com/Kozea/formol/compare/v2.9.2...v2.9.3)

- Replace `dart-sass` by `sass`
- Replace all division with slash character `/` by `math.div`

### [2.9.2](https://github.com/Kozea/formol/compare/v2.9.1...v2.9.2)

- Make the internal modified state reset to false after successful submit

### [2.9.1](https://github.com/Kozea/formol/compare/v2.9.0...v2.9.1)

- Fix the `register` function. Multiple `Field` inside `Conditional` are now initializable when mounted.

### [2.9.0](https://github.com/Kozea/formol/compare/v2.8.3...v2.9.0)

- Change `Field` component of `type="date"` into a datepicker ([react-datepicker](https://github.com/Hacker0x01/react-datepicker))
- Add `Field` component of `type="date-native"` for browsers date input

### [2.8.3](https://github.com/Kozea/formol/compare/v2.8.2...v2.8.3)

- Update dependencies (and remove jest 24 transitive dep)
- Add url native type field

### [2.8.2](https://github.com/Kozea/formol/compare/v2.8.1...v2.8.2)

- Add support for a ButtonsWrapper components prop
  to add a wrapper around submit and cancel buttons

### [2.8.1](https://github.com/Kozea/formol/compare/v2.8.0...v2.8.1)

- Use fast-deep-equal instead of deep-equal

## [2.8.0](https://github.com/Kozea/formol/compare/v2.7.1...v2.8.0)

- Add a components props for replacing submit and cancel components.

### [2.7.1](https://github.com/Kozea/formol/compare/v2.7.0...v2.7.1)

- Re-add value from item to transient item in case of dynamic field add
- Fix new bug from react-select giving null instead of empty list

## [2.7.0](https://github.com/Kozea/formol/compare/v2.6.13...v2.7.0)

- BREAKING: Remove react-draft-wysiwyg and replace it by react-quill

### [2.6.13](https://github.com/Kozea/formol/compare/v2.5.12...v2.6.13)

- Remove semi-working autohide of HTMLField (See jpuri/react-draft-wysiwyg#454 )

### [2.5.12](https://github.com/Kozea/formol/compare/v2.5.11...v2.5.12)

- Add source maps to build

### [2.5.11](https://github.com/Kozea/formol/compare/v2.5.10...v2.5.11)

- Fix select-menu value not being used when async loading choices. (#54)
- Dependencies upgrade

### [2.5.10](https://github.com/Kozea/formol/compare/v2.5.9...v2.5.10)

- Use es6 regular export from syntax for index. Removes the need of babel
  @babel/plugin-proposal-export-default-from plugin
- Dependencies upgrade

### [2.5.9](https://github.com/Kozea/formol/compare/v2.5.8...v2.5.9)

- Scroll to first field with errors on server validation error.
- Dependencies upgrade

### [2.5.8](https://github.com/Kozea/formol/compare/v2.5.7...v2.5.8)

- Fix margin selector on FieldSet\_\_label which made inliner fields not aligned.

### [2.5.7](https://github.com/Kozea/formol/compare/v2.5.6...v2.5.7)

- Fix phone pattern being ignored in TelField
- Dependencies upgrade

### [2.5.6](https://github.com/Kozea/formol/compare/v2.5.5...v2.5.6)

- Dependencies upgrade
- Migration to storybook 5

### [2.5.5](https://github.com/Kozea/formol/compare/v2.5.4...v2.5.5)

- Fix missing position relative when using SwitchButton outside of a formol Form.
  This fixes a weird bug that caused the page to scroll when toggling the switch state.

### [2.5.4](https://github.com/Kozea/formol/compare/v2.5.3...v2.5.4)

- Inliner cosmetics

### [2.5.3](https://github.com/Kozea/formol/compare/v2.5.2...v2.5.3)

- Only apply error on form when an enteredField has an error. Fix #42
- Remove Form padding and add transition on Form errors state

### [2.5.2](https://github.com/Kozea/formol/compare/v2.5.1...v2.5.2)

- Fix readOnly style of FileField previews

### [2.5.1](https://github.com/Kozea/formol/compare/v2.5.0...v2.5.1)

- Fix handleSubmit being called on enter even when onSubmit is not defined
- Dependencies upgrade

## [2.5.0](https://github.com/Kozea/formol/compare/v2.4.2...v2.5.0)

- Rework submit mecanism by using native onSubmit (fix weird enter key behavior)
- Add unmodified title on disabled form buttons
- Remove `focusNextOnEnter` prop
- Fix disabled style
- Fix missing disabled placeholder in CalendarField
- Style disabled state
- Upgrade dependencies and fix dropzone
- Adapt to storybook 4.1

### [2.4.1](https://github.com/Kozea/formol/compare/v2.4.0...v2.4.1)

- Use @babel/plugin-transform-runtime rather than medling with globals

## [2.4.0](https://github.com/Kozea/formol/compare/v2.3.3...v2.4.0)

- Add `modified` argument to onSubmit for forms with `allowUnmodifiedSubmit`.
- Make object utils importable.
- Better select-menu cosmetics

### [2.3.3](https://github.com/Kozea/formol/compare/v2.3.2...v2.3.3)

- Remove form buttons when no onSubmit is provided.
- Cosmetic fix for Inliner

### [2.3.2](https://github.com/Kozea/formol/compare/v2.3.1...v2.3.2)

- Add a `virtualizedThreshold` to virtualize select-menu choices only if it exceeds a defined number of options (100 by default)
- Keep select-menu virtualized focused element into view (#39)
- Cosmetic improvement for read-only and switch button

### [2.3.1](https://github.com/Kozea/formol/compare/v2.3.0...v2.3.1)

- Repair publishing by removing home from storyshots

## [2.3.0](https://github.com/Kozea/formol/compare/v2.2.4...v2.3.0)

- Add `validityErrors` field prop to add custom validation error messages
- Add i18n for select-menu
- Fix focus on field-set

### [2.2.4](https://github.com/Kozea/formol/compare/v2.2.3...v2.2.4)

- Add title Field prop for adding tooltips to fields

### [2.2.3](https://github.com/Kozea/formol/compare/v2.2.2...v2.2.3)

- Add `listDefaultHeight` and `listApproximatedLengthBreak` options to customize the very bad select-menu item height heuristic

### [2.2.2](https://github.com/Kozea/formol/compare/v2.2.1...v2.2.2)

- Workaround select-menu with different option height bug

### [2.2.1](https://github.com/Kozea/formol/compare/v2.2.0...v2.2.1)

- Fix missing placeholder in select-menu

## [2.2.0](https://github.com/Kozea/formol/compare/v2.1.0...v2.2.0)

- Fix choices as array of pairs
- Make Radio/Checkbox-SetFields handle non-string value like Selects.
- Fix decorators to keep known static attributes.
- Add `dangerousRawHTMLLabels` option for FieldSets to allow raw html in labels.
- Fix #38 and style disable state for form's button

## [2.1.0](https://github.com/Kozea/formol/compare/v2.0.5...v2.1.0)

- Migrate to react-select 2
- Minor fixes

### [2.0.5](https://github.com/Kozea/formol/compare/v2.0.4...v2.0.5)

- Fix non-string values not set for async loaded non-string choices.

### [2.0.4](https://github.com/Kozea/formol/compare/v2.0.3...v2.0.4)

- Add an easing on opacity transition for form loading.

### [2.0.3](https://github.com/Kozea/formol/compare/v2.0.2...v2.0.3)

- Fix long labels style in select menu. Fix #35

### [2.0.2](https://github.com/Kozea/formol/compare/v2.0.1...v2.0.2)

- Field refactoring, props processing refactored in a HOC and some rendering optimization.

### [2.0.1](https://github.com/Kozea/formol/compare/v2.0.0...v2.0.1)

- Upgrade bemboo to 2.0.0

# [2.0.0](https://github.com/Kozea/formol/compare/v1.3.1...v2.0.0)

- 100% test coverage
- Fix lots of minor bugs and unnecessary renders
- Dead code removal
- Cosmetic fixes

### [1.3.1](https://github.com/Kozea/formol/compare/v1.3.0...v1.3.1)

- Add a NoRequestNeeded exception to allow unrest onCreate/onSend methods to skip the request (and therefore avoid valid and error messages)
- Don't duplicate sass now that src is bundled

## [1.3.0](https://github.com/Kozea/formol/compare/v1.2.6...v1.3.0)

- Bundle source code and a pkg.module field to allow in your app building and code-splitting (with webpack you will have to add the `node_modules/src/formol` directory to the include of your babel rule)
- Add Formol classes property to specify additional classes on buttons
- Make sass importable without editing includePath
- Input text is always in basic color
- Range field improvements

### [1.2.6](https://github.com/Kozea/formol/compare/v1.2.5...v1.2.6)

- Add focus color for default theme. Fix #27

### [1.2.5](https://github.com/Kozea/formol/compare/v1.2.4...v1.2.5)

- Sass files organization

### [1.2.4](https://github.com/Kozea/formol/compare/v1.2.3...v1.2.4)

- Avoid crash on non-file files in FileField
- Fix default formatter/normalizer

### [1.2.3](https://github.com/Kozea/formol/compare/v1.2.2...v1.2.3)

- Make SelectField super fast (even with a lot of choices).
  Thanks to [react-virtualized-select](https://github.com/bvaughn/react-virtualized-select) and
  [react-select-fast-filter-options](https://github.com/bvaughn/react-select-fast-filter-options)

### [1.2.2](https://github.com/Kozea/formol/compare/v1.2.1...v1.2.2)

- Use an updater for Formol setState to avoid data loss

### [1.2.1](https://github.com/Kozea/formol/compare/v1.2.0...v1.2.1)

- Fix null value in Select and bad coercive equality for value.

## [1.2.0](https://github.com/Kozea/formol/compare/v1.1.10...v1.2.0)

- Handle non-string values in select field (using an internal memo)
- Add Inliner component to allow several fields in same line
- Reset form on submit when no item was given
- Allow restoring not entered state for fields from Form. Restore this state after a successful submit or a cancel.
- Align password field (take eye size in account)

### [1.1.10](https://github.com/Kozea/formol/compare/v1.1.9...v1.1.10)

- Fix typo for datetime-local type.
- Fix bad prop check for componentDidUpdate in Field.

### [1.1.9](https://github.com/Kozea/formol/compare/v1.1.8...v1.1.9)

- Add a money type.

### [1.1.8](https://github.com/Kozea/formol/compare/v1.1.7...v1.1.8)

- Use decorators for context and export contexts

### [1.1.7](https://github.com/Kozea/formol/compare/v1.1.6...v1.1.7)

- Add stars on required fields. Fix #19

### [1.1.6](https://github.com/Kozea/formol/compare/v1.1.5...v1.1.6)

- Prevent stack overflow when comparing field props in componentDidUpdate.

### [1.1.5](https://github.com/Kozea/formol/compare/v1.1.4...v1.1.5)

- Protect from unmounting in onSubmit
- Trigger a form validation on field prop change (makes async choices works better for instance, and knobs too)

### [1.1.4](https://github.com/Kozea/formol/compare/v1.1.3...v1.1.4)

- Fix `allowUnmodifiedSubmit`

### [1.1.3](https://github.com/Kozea/formol/compare/v1.1.2...v1.1.3)

- Add `allowUnmodifiedSubmit` to allow submit even if the form has no modification.

### [1.1.2](https://github.com/Kozea/formol/compare/v1.1.1...v1.1.2)

- Trigger a form validation after first render and following item props change.

### [1.1.1](https://github.com/Kozea/formol/compare/v1.1.0...v1.1.1)

- Fix range field
- Update bemboo to avoid unecessary re-render
- Make Fields PureComponents
- Localize datePatern and fix CalendarField

## [1.1.0](https://github.com/Kozea/formol/compare/v1.0.6...v1.1.0)

- Log error on bad return value from onSubmit
- Add required class on fields
- Fix useless re-rendering with a better types comparison
- Fix errors being ignored in FileField

### [1.0.6](https://github.com/Kozea/formol/compare/v1.0.5...v1.0.6)

- Remove choiceGetter (get your choice in your form instead)

### [1.0.5](https://github.com/Kozea/formol/compare/v1.0.4...v1.0.5)

- Improve unrest error handling

### [1.0.4](https://github.com/Kozea/formol/compare/v1.0.3...v1.0.4)

- Wrap the eye toggler for password strength field
- Fix Password field style related to #18
- Remove password (and strength) type text at blur
- Send the right item on create

### [1.0.3](https://github.com/Kozea/formol/compare/v1.0.2...v1.0.3)

- Fix SelectField onChange bad signature

### [1.0.2](https://github.com/Kozea/formol/compare/v1.0.1...v1.0.2)

- Add an extra parameter for form that will be called with the state (can be useful for prompting with react-router for example).
- Fix creation pk test in unrest wrapper.

### [1.0.1](https://github.com/Kozea/formol/compare/v1.0.0...v1.0.1)

- Use a mapping as argument for unrest and export it publicly

# [1.0.0](https://github.com/Kozea/formol/compare/v0.0.0...v1.0.0)

- First release
- Refactor everything (see commit log)

# [0.0.0](https://github.com/Kozea/formol/compare/...v0.0.0)

- Pre release
