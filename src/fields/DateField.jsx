import React from 'react'
import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format, parse } from 'date-fns'
import { fr, enUS } from 'date-fns/locale'
import MaskedInput from 'react-text-mask'

import { block } from '../utils'

import './Datefield.css'

@block
export default class DateField extends React.PureComponent {
  componentDidMount() {
    const { readOnly, disabled, elementRef } = this.props
    if (!(readOnly || disabled)) {
      elementRef.current = this.datepicker.customInput
    }
  }
  componentWillUnmount() {
    const { elementRef } = this.props
    elementRef.current = null
  }
  render(b) {
    const {
      value,
      onBlur,
      onChange,
      onFocus,
      i18n,
      readOnly,
      required,
      name,
      placeholder,
      disabled,
      format: userFormat,
      className,
      ...datepickerProps
    } = this.props
    const restOfProps = { onBlur, onFocus, readOnly, required, name, disabled }
    const locales = { fr, en: enUS }
    const locale = locales[i18n.calendar.locale]
    const dateFormat = userFormat || i18n.calendar.dateFormat
    const isoDateFormat = 'yyyy-MM-dd'

    return (
      <Datepicker
        ref={(ref) => (this.datepicker = ref)}
        selected={value ? parse(value, isoDateFormat, new Date()) : null}
        onChange={(date) => {
          this.setState({ date })
          onChange(date ? format(date, isoDateFormat) : '')
        }}
        isClearable={!(disabled || readOnly)}
        locale={locale}
        dateFormat={dateFormat}
        className={b.mix('Formol_InputField').mix(className).s}
        shouldCloseOnSelect
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        placeholderText={placeholder || dateFormat}
        {...restOfProps}
        {...datepickerProps}
        customInput={
          <MaskedInput
            type="text"
            mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
          />
        }
      />
    )
  }
}
