export default {
  // General
  yes: 'Yes',
  no: 'No',
  submit: 'Submit',
  cancel: 'Cancel',
  required: 'Please fill out this field',
  unmodified: 'No change in form',
  // CalendarField
  calendar: {
    dateFormat: 'MM/dd/yyyy',
    datePattern: /^(0[0-9]|10|11|12)\/([0-2][0-9]|30|31)\/[0-9]{4}$/,
    dateError: 'Date must match mm/dd/yyyy format',
    locale: 'en',
  },
  file: {
    rejected: 'Please select a valid file.',
    rejectedMultiple: 'Some of your files are invalid.',
    noFile: 'No file',
    singleOnly: 'Please select only one file',
  },
  html: {
    placeholder: 'Enter text here',
  },
  tel: {
    /*
     * pattern is validated with v flag
     * https://stackoverflow.com/a/76287241
     */
    // eslint-disable-next-line no-useless-escape
    pattern: /\d{3}[\-]\d{3}[\-]\d{4}/,
  },
  passwordStrength: {
    tooshort: 'too short',
    tooweak: 'too weak',
    weak: 'weak',
    average: 'average',
    strong: 'strong',
    stronger: 'stronger',
    error: 'Please choose a more secure password.',
  },
  money: {
    unit: '$',
    precision: 2,
  },
  selectMenu: {
    noOptions: () => 'No options',
    loading: () => 'Loading',
    select: 'Select…',
  },
}
