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
