import { format, parse, toDate } from 'date-fns'
import localeFr from 'date-fns/locale/fr'

export { localeFr }

export const localeDateFormatFr = (date, dateFormat = 'D MMMM YYYY') =>
  format(toDate(date), dateFormat, { locale: localeFr })

export const formatDayFr = day => localeDateFormatFr(day, 'ddd ll')

export const formatMonthTitleFr = date => localeDateFormatFr(date, 'MMMM YYYY')

export const formatWeekdayShortFr = day =>
  localeFr.localize.weekday(day, { type: 'short' }).replace(/.$/, '')

export const formatWeekdayLongFr = day =>
  localeFr.localize.weekday(day, { type: 'long' })

// Fix this when date-fns has a first day of week
export const getFirstDayOfWeekFr = () => 1

export const getMonthsFr = () =>
  Array(12)
    .fill()
    .map((_, i) => localeFr.localize.months(i, { type: 'long' }))

export const formatDateFr = (date, format_ = 'L') =>
  localeDateFormatFr(date, format_)

export const parseDateFr = (str, format_ = 'L') =>
  parse(str, format_, new Date(), { locale: localeFr })

export const CalendarFr = {
  formatDay: formatDayFr,
  formatMonthTitle: formatMonthTitleFr,
  formatWeekdayShort: formatWeekdayShortFr,
  formatWeekdayLong: formatWeekdayLongFr,
  getFirstDayOfWeek: getFirstDayOfWeekFr,
  getMonths: getMonthsFr,
  formatDate: formatDateFr,
  parseDate: parseDateFr,
}
