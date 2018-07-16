import { format, toDate } from 'date-fns'
import localeFr from 'date-fns/locale/fr'

const getCalendarLocaleUtils = (locale, fdow = 0) => ({
  formatDay: date => format(toDate(date), 'PPPP', { locale }),
  formatMonthTitle: date => format(toDate(date), 'MMMM yyyy', { locale }),
  formatWeekdayLong: day => locale.localize.day(day, { width: 'wide' }),
  formatWeekdayShort: day =>
    locale.localize.day(day, { width: 'abbreviated' }).replace(/.$/, ''),
  // Fix this when date-fns has a first day of week
  getFirstDayOfWeek: () => fdow,
})

export default {
  fr: {
    calendar: getCalendarLocaleUtils(localeFr),
    date: localeFr,
  },
}
