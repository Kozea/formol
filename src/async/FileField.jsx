import './FileField.sass'

import deepEqual from 'deep-equal'
import React, { Fragment } from 'react'
import Dropzone from 'react-dropzone'
import FaTrash from 'react-icons/lib/fa/trash'
import MdCloudUpload from 'react-icons/lib/md/cloud-upload'

import {
  block,
  fileSize,
  nameExt,
  normalizeMultipleProps,
  readAsBase64,
  staticUrl,
} from '../utils'
import Preview from '../utils/Preview'

const key = file => [file.name, file.ext].join('.')

const rename = files =>
  files.reduce(
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
  ).renamed

@block
export default class FileField extends React.Component {
  static valueToField(value, multiple) {
    if (!value) {
      return ''
    }
    if (multiple) {
      return value.map(key).join(',')
    }
    return key(value)
  }

  static getDerivedStateFromProps(newProps, { value: oldValue }) {
    const {
      multiple,
      elementRef: { current },
      value: rawValue,
    } = normalizeMultipleProps(newProps)
    const value = FileField.valueToField(rawValue, multiple)
    if (value !== oldValue) {
      current && (current.value = value)
      return {
        value,
        rejected: [],
      }
    }
    return null
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

  componentDidUpdate({ value: oldValue }, { rejected: oldRejected }) {
    const { value } = this.props
    const { rejected } = this.state
    if (rejected !== oldRejected && !deepEqual(value, oldValue)) {
      this.handleChange(value, rejected)
    }
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
    onChange(
      value,
      rejected.length
        ? multiple
          ? `${i18n.file.rejectedMultiple} (${rejected.join(', ')})`
          : i18n.file.rejected
        : ''
    )
  }

  async handleDrop(acceptedFiles, rejectedFiles) {
    const {
      value,
      multiple,
      elementRef: { current },
      onFocus,
      onBlur,
    } = normalizeMultipleProps(this.props)
    onFocus()
    let { rejected } = this.state
    const files = await Promise.all(
      acceptedFiles.concat(rejectedFiles).map(this.fileToObject)
    )
    if (multiple && rejectedFiles.length) {
      rejected = [...rejected, ...files.slice(-rejectedFiles.length).map(key)]
    }
    if (!multiple) {
      rejected = rejected.filter(rej => rej !== key(value))
    }
    const newFiles = multiple ? rename([...files, ...value]) : files[0]
    const newValue = FileField.valueToField(newFiles, multiple)
    current.value = newValue
    this.setState({ value: newValue, rejected })
    this.handleChange(newFiles, rejected)
    onBlur()
  }

  handleRemove(e, file) {
    const {
      value,
      multiple,
      elementRef: { current },
    } = normalizeMultipleProps(this.props)
    const changed = multiple ? value.filter(f => key(f) !== key(file)) : null
    const rejected = this.state.rejected.filter(rej => rej !== key(file))

    const newValue = FileField.valueToField(changed, multiple)
    current.value = newValue
    this.setState({
      value: newValue,
      rejected,
    })
    this.handleChange(changed, rejected)
    e.stopPropagation()
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
          <Preview
            src={file.url && staticUrl(file.url)}
            data={file.data}
            mime={file.type}
            ext={file.ext}
          />
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
          <span className={b.e('preview-name')}>{fileKey} </span>
          {file.size && (
            <span className={b.e('preview-size')}>{fileSize(file.size)} </span>
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
      rejectedMessage,
      onChange,
      onKeyDown,
      ...inputProps
    } = normalizeMultipleProps(this.props)

    const { rejected } = this.state
    let preview = null
    if (multiple) {
      preview = (
        <Fragment>{value.map(file => this.renderPreview(b, file))}</Fragment>
      )
    } else if (value) {
      preview = this.renderPreview(b, value)
    }

    if (readOnly || disabled) {
      return (
        <div className={b.mix(className)}>{preview || i18n.file.noFile}</div>
      )
    }

    return (
      <div className={b.mix(className).m({ invalid: !!rejected.length })}>
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
          inputProps={inputProps}
        >
          <div className={b.e('placeholder')}>
            {!multiple && preview ? (
              preview
            ) : (
              <Fragment>
                <MdCloudUpload />
                <span>{placeholder}</span>
              </Fragment>
            )}
          </div>
        </Dropzone>
        {multiple && <div className={b.e('previews')}>{preview}</div>}
        <input
          className={b.e('hidden-input')}
          ref={elementRef}
          {...inputProps}
          defaultValue={FileField.valueToField(value, multiple)}
          type="text" // We need a text input instead of the file one
          // because file inputs are read-only
        />
      </div>
    )
  }
}
