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
