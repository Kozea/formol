import { diff } from '../utils/object'

function NoRequestNeeded(message) {
  this.name = 'NoRequestNeeded'
  this.message = message
  this.stack = new Error().stack
}
NoRequestNeeded.prototype = new Error()

export { NoRequestNeeded }

export default ({ pk, onCreate, onPatch, onValid, onError, onFail }) =>
  async (transientItem, item, names) => {
    let onSend, args
    const pks = pk(item)
    // If some pk values are undefined, consider that it's a create
    const mode =
      !Object.keys(pks).length || Object.values(pks).some((v) => v === void 0)
        ? 'create'
        : 'patch'
    if (mode === 'create') {
      onSend = onCreate
      args = [transientItem]
    } else {
      onSend = onPatch
      args = [pks, diff(transientItem, item, names)]
    }

    let report
    try {
      report = await onSend(...args)
    } catch (err) {
      if (err instanceof NoRequestNeeded) {
        return {}
      }
      onFail && onFail(err, mode)
      return
    }

    if (report.metadata.code === 202) {
      // If it's invalid, errors should be reported
      return report.metadata.errors[0].fields
    }
    if (report.metadata.code === 200) {
      onValid && onValid(report, mode)
      // If it's valid, errors should be removed
      return {}
    }
    onError && onError(report, mode)
  }
