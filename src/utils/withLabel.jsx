import { FaQuestionCircle } from 'react-icons/fa'
import React from 'react'

export default function withLabel(WrappedComponent) {
  class WithLabel extends React.PureComponent {
    render() {
      if (!this.props.fieldClassName) {
        // Don't rewrap
        return <WrappedComponent {...this.props} />
      }
      const {
        name,
        value,
        type,
        title,
        modified,
        readOnly,
        disabled,
        unit,
        extras,
        classNameModifiers,
        error,

        focus,
        LabelComponent,
        fieldClassName,
        labelChildren,
        ...props
      } = this.props

      return (
        <div
          className={fieldClassName.m({
            type,
            name,
            error: !!error,
            disabled,
            readOnly,
            required: !!props.required,
            modified,
            focus,
            ...classNameModifiers.field,
          })}
        >
          <LabelComponent
            className={fieldClassName.e('label').m(classNameModifiers.label)}
            title={title}
          >
            {labelChildren && (
              <span
                className={fieldClassName
                  .e('title')
                  .m(classNameModifiers.labelText)}
              >
                {labelChildren}
                {title && <FaQuestionCircle />}
              </span>
            )}
            <WrappedComponent
              name={name}
              value={value}
              type={type}
              disabled={disabled}
              readOnly={readOnly}
              {...props}
            />
            {unit && (
              <div
                className={fieldClassName.e('unit').m(classNameModifiers.unit)}
              >
                {unit}
              </div>
            )}
            {extras}
          </LabelComponent>
          {error && (
            <div
              className={fieldClassName
                .e('error-text')
                .m(classNameModifiers.error)}
            >
              {error}
            </div>
          )}
        </div>
      )
    }
  }

  WithLabel.WrappedComponent = WrappedComponent
  WithLabel.defaultFieldProps = WrappedComponent.defaultFieldProps
  WithLabel.formolFieldLabelElement = WrappedComponent.formolFieldLabelElement
  return WithLabel
}
