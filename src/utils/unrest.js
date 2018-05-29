import { diff } from './object'

export default (getPk, onCreate, onPatch, onValid, onError) => async (
  transientItem,
  item,
  names
) => {
  let onSend, args
  const pk = getPk(item)
  const mode = pk === void 0 ? 'create' : 'patch'
  if (mode === 'create') {
    onSend = onCreate
    args = [item]
  } else {
    onSend = onPatch
    args = [pk, diff(transientItem, item, names)]
  }

  const report = await onSend(...args)

  if (report.metadata.code === 200) {
    onValid && onValid(report, mode)
  } else if (report.metadata.code === 202) {
    return report.metadata.errors[0].fields
  } else {
    onError && onError(report, mode)
  }
}
