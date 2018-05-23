import './FileField.sass'

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

const nonExistingFileName = ([name, ext], value) => {
  let i = 0
  let fn = name
  const nameFinder = n => f => key(f) === key({ name: n, ext })
  while (i < 100 && value.find(nameFinder(fn))) {
    i++
    fn = `${fn}_${i}`
  }
  if (i === 100) {
    throw new Error('Sorry we don’t support 100+ files with the same name')
  }
  return [fn, ext]
}

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
      value,
    } = normalizeMultipleProps(newProps)
    if (value !== oldValue) {
      current && (current.value = FileField.valueToField(value, multiple))
      return {
        value,
        error: null,
      }
    }
    return null
  }
  constructor(props) {
    super(props)
    this.state = {
      value: null,
      error: null,
    }
    this.handleDrop = this.handleDrop.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
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

  async handleDrop(accepted, rejected) {
    const {
      value,
      multiple,
      rejectedMessage,
      i18n,
      elementRef: { current },
      onChange,
    } = normalizeMultipleProps(this.props)
    let changed = null
    if (multiple) {
      accepted = await Promise.all(accepted.map(this.fileToObject))

      // We can't map here because of name checking (prevent collisions)
      const newFiles = []
      accepted.forEach(({ name, ext, type, size, data }) => {
        ;[name, ext] = nonExistingFileName(
          [name, ext],
          [...value.filter(f => f.data), ...newFiles]
        )
        newFiles.push({
          name,
          ext,
          type,
          size,
          data,
        })
      })

      const erroredFiles = rejected.map(({ name: fn, type, size }) => {
        const [name, ext] = nameExt(fn)
        return {
          name,
          ext,
          type,
          size,
        }
      })

      // Removing error files and adding new files and new errors
      changed = [...value.filter(f => f.data), ...newFiles, ...erroredFiles]
    } else {
      if (!accepted.length && !rejected.length) {
        console.warn('Nothing sent on onDrop')
        return
      }
      changed = await this.fileToObject(accepted[0] || rejected[0])
    }
    let err = null
    if (rejected.length) {
      err =
        rejectedMessage ||
        (multiple ? i18n.file.rejectedMultiple : i18n.file.rejected)
    }
    current.value = FileField.valueToField(changed, multiple)

    if (err) {
      this.setState({ error: err })
      current.setCustomValidity(err)
      current.reportValidity && current.reportValidity()
    } else {
      this.setState({ error: null })
      current.setCustomValidity('')
    }
    this.setState({ value: current.value })
    onChange(changed)
  }

  handleRemove(e, file) {
    const {
      value,
      multiple,
      elementRef: { current },
      onChange,
    } = normalizeMultipleProps(this.props)
    let changed = null
    if (multiple) {
      if (file) {
        changed = value.filter(f => key(f) !== key(file))
      } else {
        changed = []
      }
    }
    this.setState({ value: current.value })
    onChange(changed)
    e.stopPropagation()
  }

  renderPreview(b, file) {
    const { disabled, readOnly } = this.props
    const { error } = this.state
    return (
      <figure
        className={b.e('preview', { error })}
        key={`${file.name}.${file.ext}`}
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
          <span className={b.e('preview-name')}>{key(file)} </span>
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

    const { error } = this.state
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
      <div className={b.mix(className).m({ invalid: !!error })}>
        <Dropzone
          accept={accept || 'image/*'}
          className={b.e('dropzone').s}
          activeClassName={b.e('dropzone').m({ active: true }).s}
          acceptClassName={b.e('dropzone').m({ accept: true }).s}
          rejectClassName={b.e('dropzone').m({ reject: true }).s}
          disabledClassName={b.e('dropzone').m({ disabled: true }).s}
          name={name}
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
        {multiple && preview ? preview : null}
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
