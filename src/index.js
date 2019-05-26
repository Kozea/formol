// This is not optimal, we might need to find a better solution
export { default } from './Formol'
export { default as Field } from './Field'
export * from './FieldBase'
export { default as Inliner } from './Inliner'
export { default as Conditional } from './Conditional'
export { default as FormolContextWrapper, FormolContext } from './FormolContext'
export {
  default as ConditionalContextWrapper,
  ConditionalContext,
} from './ConditionalContext'

export { default as SwitchButton } from './utils/SwitchButton'
export { default as unrest, NoRequestNeeded } from './ext/unrest'
export {
  nullishToEmptyString,
  emptyStringToNull,
  get,
  set,
  copy,
  insert,
  diff,
  isModified,
} from './utils/object'

export { default as choicesAdapter } from './utils/choicesAdapter'
export { default as memoizedChoices } from './utils/memoizedChoices'
export { default as multipleAdapter } from './utils/multipleAdapter'

console.log('FORMOL Exporting my own data NOW !!!!')
