import { format, parse, toDate } from 'date-fns'
import localeFr from 'date-fns/locale/fr'

export const locale = localeFr

export const localeDateFormat = (date, dateFormat = 'D MMMM YYYY') =>
  format(toDate(date), dateFormat, { locale })

export const formatDay = day => localeDateFormat(day, 'ddd ll')

export const formatMonthTitle = date => localeDateFormat(date, 'MMMM YYYY')

export const formatWeekdayShort = day =>
  locale.localize.weekday(day, { type: 'short' }).replace(/.$/, '')

export const formatWeekdayLong = day =>
  locale.localize.weekday(day, { type: 'long' })

// Fix this when date-fns has a first day of week
export const getFirstDayOfWeek = () => 1

export const getMonths = () =>
  Array(12)
    .fill()
    .map((_, i) => locale.localize.months(i, { type: 'long' }))

export const formatDate = (date, format = 'L') => localeDateFormat(date, format)

export const parseDate = (str, format = 'L') =>
  parse(str, format, new Date(), { locale })

export default {
  formatDay,
  formatMonthTitle,
  formatWeekdayShort,
  formatWeekdayLong,
  getFirstDayOfWeek,
  getMonths,
  formatDate,
  parseDate,
}
