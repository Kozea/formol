import { FaTrash } from 'react-icons/fa'
import { MdCloudUpload } from 'react-icons/md'
import Dropzone from 'react-dropzone'
import React from 'react'
import deepEqual from 'deep-equal'

import { block, fileSize, nameExt, noOp, readAsBase64 } from '../utils'
import Preview from '../utils/Preview'
import multipleAdapter from '../utils/multipleAdapter'

const key = file => [file.name, file.ext].join('.')

const rename = files =>
  files
    .reverse()
    .reduce(
      ({ renamed, counter }, file) => {
        const name = file.name.replace(/--\d+$/, '')
        const k = key({ ...file, name })
        const newCounter = {
          ...counter,
          [k]: k in counter ? counter[k] + 1 : 0,
        }
        return {
          counter: newCounter,
          renamed: [
            ...renamed,
            {
              ...file,
              name: newCounter[k] ? `${name}--${newCounter[k]}` : name,
            },
          ],
        }
      },
      { renamed: [], counter: {} }
    )
    .renamed.reverse()

@multipleAdapter
@block
export default class FileField extends React.PureComponent {
  static valueToField(value, multiple) {
    if (!value) {
      return ''
    }
    if (multiple) {
      return value.map(key).join(',')
    }
    return key(value)
  }

  constructor(props) {
    super(props)
    this.state = {
      value: null,
      rejected: [],
    }
    this.dropzone = React.createRef()
    this.handleDrop = this.handleDrop.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
  }

  static getDerivedStateFromProps(
    newProps,
    { value: oldValue, rejected: oldRejected }
  ) {
    const {
      multiple,
      elementRef: { current },
      value: rawValue,
    } = newProps
    const value = FileField.valueToField(rawValue, multiple)
    if (!deepEqual(value, oldValue)) {
      const rejected = oldRejected.filter(
        f => (multiple ? value.split(',').includes(f) : value === f)
      )
      current && (current.value = value)
      return {
        value,
        rejected,
      }
    }
    return null
  }

  async fileToObject(file) {
    const [name, ext] = nameExt(file.name)
    return {
      name,
      ext,
      type: file.type,
      size: file.size,
      data: (await readAsBase64(file)).split(',', 2)[1],
    }
  }

  handleChange(value, rejected) {
    const { i18n, multiple, onChange } = this.props
    const error = rejected.length
      ? multiple
        ? `${i18n.file.rejectedMultiple} (${rejected.join(', ')})`
        : i18n.file.rejected
      : ''
    onChange(value, error)
  }

  async handleDrop(acceptedFiles, rejectedFiles) {
    const {
      value,
      multiple,
      onFocus,
      onBlur,
      elementRef: { current },
    } = this.props
    onFocus()
    let { rejected } = this.state
    rejectedFiles = rejectedFiles.filter(maybeFile => maybeFile.name)
    const files = await Promise.all(
      acceptedFiles.concat(rejectedFiles).map(this.fileToObject)
    )
    if (rejectedFiles.length) {
      rejected = [...rejected, ...files.slice(-rejectedFiles.length).map(key)]
    }
    const newFiles = multiple ? rename([...files, ...value]) : files[0]
    const newValue = FileField.valueToField(newFiles, multiple)
    if (!multiple) {
      rejected = rejected.includes(newValue) ? [newValue] : []
    }
    current.value = newValue
    this.handleChange(newFiles, rejected)
    this.setState({ value: newValue, rejected })
    onBlur()
  }

  handleRemove(e, file) {
    const {
      value,
      multiple,
      elementRef: { current },
      onFocus,
      onBlur,
    } = this.props
    onFocus()
    const changed = multiple ? value.filter(f => key(f) !== key(file)) : null
    const rejected = this.state.rejected.filter(rej => rej !== key(file))

    const newValue = FileField.valueToField(changed, multiple)
    current.value = newValue
    this.handleChange(changed, rejected)
    this.setState({
      value: newValue,
      rejected,
    })
    e.stopPropagation()
    onBlur()
  }

  renderPreview(b, file) {
    const { disabled, readOnly } = this.props
    const { rejected } = this.state
    const fileKey = key(file)
    return (
      <figure
        className={b.e('preview').m({ error: rejected.includes(fileKey) })}
        key={fileKey}
      >
        <div className={b.e('image-delete')}>
          <Preview data={file.data} mime={file.type} ext={file.ext} />
          {!readOnly && !disabled ? (
            <button
              className={b.e('close')}
              onClick={e => this.handleRemove(e, file)}
              type="button"
            >
              <FaTrash /> Enlever
            </button>
          ) : null}
        </div>
        <figcaption className={b.e('preview-caption')}>
          <span className={b.e('preview-name')}>{fileKey}</span>
          {file.size && (
            <span className={b.e('preview-size')}>{fileSize(file.size)}</span>
          )}
          {file.type && (
            <span className={b.e('preview-type')}>{file.type}</span>
          )}
        </figcaption>
      </figure>
    )
  }

  render(b) {
    const {
      name,
      value,
      i18n,
      accept,
      placeholder,
      className,
      multiple,
      readOnly,
      disabled,
      elementRef,
      onChange,
      onKeyDown,
      ...inputProps
    } = this.props
    const { rejected } = this.state
    let preview = null
    if (multiple) {
      preview = value.map(file => this.renderPreview(b, file))
    } else if (value) {
      preview = this.renderPreview(b, value)
    }

    if (readOnly || disabled) {
      return (
        <div className={b.mix(className)}>{preview || i18n.file.noFile}</div>
      )
    }

    return (
      <div className={b.m({ invalid: !!rejected.length })}>
        <Dropzone
          accept={accept || 'image/*'}
          className={b.e('dropzone').s}
          activeClassName={b.e('dropzone').m({ active: true }).s}
          acceptClassName={b.e('dropzone').m({ accept: true }).s}
          rejectClassName={b.e('dropzone').m({ reject: true }).s}
          disabledClassName={b.e('dropzone').m({ disabled: true }).s}
          name={name}
          ref={this.dropzone}
          multiple={multiple}
          onDrop={this.handleDrop}
        >
          <div className={b.e('placeholder')}>
            {!multiple && preview ? (
              preview
            ) : (
              <>
                <MdCloudUpload />
                <span>{placeholder}</span>
              </>
            )}
          </div>
        </Dropzone>
        {multiple && <div className={b.e('previews')}>{preview}</div>}
        <input
          className={b.mix(className).e('hidden-input')}
          ref={elementRef}
          {...inputProps}
          value={FileField.valueToField(value, multiple)}
          onChange={noOp}
          type="text" // We need a text input instead of the file one
          // because file inputs are read-only
        />
      </div>
    )
  }
}
