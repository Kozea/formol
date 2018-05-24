import { diffObject } from './object'

export default (getPk, onCreate, onPatch, onValid, onError) => async (
  transientItem,
  item
) => {
  let onSend, args
  const pk = getPk(item)
  if (pk === void 0) {
    onSend = onCreate
    args = [item]
  } else {
    onSend = onPatch
    args = [pk, diffObject(transientItem, item)]
  }

  const report = await onSend(...args)

  if (report.metadata.code === 200) {
    onValid && onValid(report)
  } else if (report.metadata.code === 202) {
    return report.metadata.errors[0].fields
  } else {
    onError && onError(report)
  }
}
