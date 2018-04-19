import './CalendarField.sass'

import { format, parse } from 'date-fns'
import React from 'react'

import ReactDayPicker from '../async/ReactDayPicker'
import { block } from '../utils'
import CalendarLocale, { locale } from '../utils/locale'

const isDate = d => d instanceof Date && !isNaN(d.valueOf())
const datePattern = /^([0-2][0-9]|30|31)\/(0[0-9]|10|11|12)\/[0-9]{4}$/
const voidIfNaN = d => (isNaN(d.valueOf()) ? void 0 : d)

@block
export default class CalendarField extends React.Component {
  handleChange(newDate) {
    const { onChange } = this.props
    if (isDate(newDate)) {
      onChange({ target: { value: format(newDate, 'YYYY-MM-DD', { locale }) } })
    } else {
      onChange({ target: { value: newDate || null } })
    }
  }

  render(b) {
    const {
      className,
      format: userFormat,
      value,
      readOnly,
      disabled,
      ...inputProps
    } = this.props
    const dateFormat = userFormat || 'DD/MM/YYYY'
    const maybeDate = parse(value, 'YYYY-MM-DD', new Date(), { locale })
    const date = isDate(maybeDate) ? maybeDate : value
    if (readOnly || disabled) {
      return (
        <input
          type="text"
          className={b.mix(className)}
          readOnly={readOnly}
          disabled={disabled}
          value={isDate(maybeDate) ? format(date, dateFormat) : value}
        />
      )
    }
    return (
      <ReactDayPicker
        classNames={{
          container: b.mix('DayPickerInput').s,
          overlayWrapper: b
            .e('overlay-wrapper')
            .mix('DayPickerInput-OverlayWrapper').s,
          overlay: b.e('overlay').mix('DayPickerInput-Overlay').s,
        }}
        value={date}
        placeholder="jj/mm/aaaa"
        format={dateFormat}
        formatDate={(value_, format_) => format(value_, format_, { locale })}
        parseDate={(value_, format_) =>
          datePattern.exec(value_)
            ? voidIfNaN(parse(value_, format_, new Date(), { locale }))
            : void 0
        }
        dayPickerProps={{ locale: 'fr', localeUtils: CalendarLocale }}
        onDayChange={o => this.handleChange(o)}
        inputProps={{
          ...inputProps,
          pattern: datePattern.source,
          title: 'La date doit être au format jj/mm/aaaa',
          className: b.e('field').mix(className),
        }}
      />
    )
  }
}
