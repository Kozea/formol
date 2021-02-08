import React from 'react'
import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import { fr, enUS } from 'date-fns/locale'

import { block } from '../utils'

import './Datefield.css'

@block
export default class DateField extends React.PureComponent {
  componentDidMount() {
    const { readOnly, disabled, elementRef } = this.props
    if (!(readOnly || disabled)) {
      elementRef.current = this.datepicker.input
    }
  }
  componentWillUnmount() {
    const { elementRef } = this.props
    elementRef.current = null
  }
  render() {
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
    } = this.props
    const restOfProps = { onBlur, onFocus, readOnly, required, name, disabled }
    const isLocaleFr = i18n.calendar.locale === 'fr'
    const locale = isLocaleFr ? fr : enUS
    const dateFormat = isLocaleFr ? 'dd/MM/yyyy' : 'MM/dd/yyyy'

    return (
      <Datepicker
        ref={ref => (this.datepicker = ref)}
        selected={value ? new Date(value) : null}
        onChange={date => {
          this.setState({ date })
          onChange(date ? format(date, 'yyyy-MM-dd') : '')
        }}
        isClearable={!(disabled || readOnly)}
        locale={locale}
        dateFormat={dateFormat}
        className="Formol_InputField Formol_DateField Formol_Field__element"
        shouldCloseOnSelect
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        placeholderText={placeholder || dateFormat}
        {...restOfProps}
      />
    )
  }
}
