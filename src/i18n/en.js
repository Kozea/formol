export default {
  // General
  yes: 'Yes',
  no: 'No',
  submit: 'Submit',
  cancel: 'Cancel',
  required: 'Please fill out this field',
  // CalendarField
  calendar: {
    dateFormat: 'MM/DD/YYYY',
    datePattern: /^(0[0-9]|10|11|12)\/([0-2][0-9]|30|31)\/[0-9]{4}$/,
    dateError: 'Date must match mm/dd/yyyy format',
    locale: 'en',
  },
  file: {
    rejected: 'Please select a valid file.',
    rejectedMultiple: 'Some of your files are invalid.',
    noFile: 'No file',
  },
  html: {
    placeholder: 'Enter text here',
  },
  passwordStrength: {
    weak: 'weak',
    okay: 'okay',
    good: 'good',
    strong: 'strong',
    stronger: 'stronger',
    tooshort: 'too short',
    error: 'Please choose a more secure password.',
  },
  money: {
    unit: '$',
    precision: 2,
  },
}
