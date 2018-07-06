import 'react-day-picker/lib/style.css'

import { format, parse } from 'date-fns'
import React from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput'

import { block } from '../utils'
import { CalendarFr, localeFr } from './CalendarFieldLocale'

const isDate = d => d instanceof Date && !isNaN(d.valueOf())
const voidIfNaN = d => (isNaN(d.valueOf()) ? void 0 : d)

@block
export default class CalendarField extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    const { readOnly, disabled, elementRef } = this.props
    if (!(readOnly || disabled)) {
      elementRef.current = this.daypicker.input
    }
  }

  componentWillUnmount() {
    const { elementRef } = this.props
    elementRef.current = null
  }

  handleChange(newDate) {
    const { i18n, onChange } = this.props
    const locale = i18n.calendar.locale === 'fr' ? localeFr : void 0
    onChange(
      isDate(newDate)
        ? format(newDate, 'YYYY-MM-DD', { locale })
        : newDate || null
    )
  }

  render(b) {
    const {
      className,
      elementRef,
      i18n,
      placeholder,
      format: userFormat,
      pattern,
      value,
      readOnly,
      disabled,
      type,
      onChange,
      ...inputProps
    } = this.props
    const locale = i18n.calendar.locale === 'fr' ? localeFr : void 0
    const dateFormat = userFormat || i18n.calendar.dateFormat
    const datePattern = pattern || i18n.calendar.datePattern
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
      <DayPickerInput
        classNames={{
          container: b.mix('DayPickerInput').s,
          overlayWrapper: b
            .e('overlay-wrapper')
            .mix('DayPickerInput-OverlayWrapper').s,
          overlay: b.e('overlay').mix('DayPickerInput-Overlay').s,
        }}
        value={date}
        ref={ref => (this.daypicker = ref)}
        placeholder={placeholder || dateFormat}
        format={dateFormat}
        formatDate={(value_, format_) => format(value_, format_, { locale })}
        parseDate={(value_, format_) =>
          datePattern.exec(value_)
            ? voidIfNaN(parse(value_, format_, new Date(), { locale }))
            : void 0
        }
        dayPickerProps={
          i18n.calendar.locale === 'fr'
            ? { locale: 'fr', localeUtils: CalendarFr }
            : {}
        }
        onDayChange={this.handleChange}
        inputProps={{
          ...inputProps,
          pattern: datePattern.source,
          title: i18n.calendar.dateError,
          className: b.e('field').mix(className),
        }}
      />
    )
  }
}
