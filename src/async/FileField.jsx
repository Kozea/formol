import './FileField.sass'

import React, { Fragment } from 'react'
import Dropzone from 'react-dropzone'
import FaTrash from 'react-icons/lib/fa/trash'
import MdCloudUpload from 'react-icons/lib/md/cloud-upload'

import { block, fileSize, nameExt, readAsBase64, staticUrl } from '../utils'
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
  constructor(props) {
    super(props)
    this.state = {
      error: null,
    }
    this.handleDrop = this.handleDrop.bind(this)
  }

  checkValidity() {
    return !this.state.error
  }

  async handleDrop(accepted, rejected, { target }) {
    const { multiple, rejectedMessage, i18n, onChange } = this.props
    const value = multiple ? this.props.value || [] : []
    accepted = await Promise.all(
      accepted.map(async file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        data: (await readAsBase64(file)).split(',', 2)[1],
      }))
    )
    // We can't map here because of name checking (prevent collisions)
    const newFiles = []
    accepted.forEach(({ name: fn, type, size, data }) => {
      const [newName, ext] = nonExistingFileName(nameExt(fn), [
        ...value.filter(f => f.data),
        ...newFiles,
      ])
      const fks = {}
      // TOOD: fix that
      // if (fKey) {
      //   const fKeys = typeof fKey === 'string' ? [fKey] : fKey
      //   fKeys.map(fk => {
      //     fks[fk] = this.context.edited[fk]
      //   })
      // }
      newFiles.push({
        name: newName,
        ext,
        type,
        size,
        data,
        ...fks,
      })
    })

    const erroredFiles = rejected.map(({ name: fn, type, size }) => {
      const [newName, ext] = nameExt(fn)
      return {
        name: newName,
        ext,
        type,
        size,
      }
    })
    if (erroredFiles.length) {
      const err =
        rejectedMessage ||
        (multiple ? i18n.file.rejectedMultiple : i18n.file.rejected)
      this.setState({ error: err })
      target.setCustomValidity(err)
    } else {
      this.setState({ error: null })
      target.setCustomValidity('')
    }
    onChange(
      // Removing error files and adding new files and new errors
      [...value.filter(f => f.data), ...newFiles, ...erroredFiles]
    )
  }

  render(b) {
    const {
      name,
      value,
      i18n,
      accept,
      placeholder,
      onChange,
      className,
      multiple,
      readOnly,
      disabled,
      ...inputProps
    } = this.props
    delete inputProps.fKey
    delete inputProps.rejectedMessage

    const { error } = this.state
    const preview = value.length ? (
      <Fragment>
        {value.map(file => (
          <figure className={b.e('preview')} key={`${file.name}.${file.ext}`}>
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
                  kind="disabled"
                  onClick={e => {
                    onChange(value.filter(f => key(f) !== key(file)))
                    this.setState({ error: null })
                    e.stopPropagation()
                  }}
                >
                  <FaTrash /> Enlever
                </button>
              ) : null}
            </div>
            <figcaption className={b.e('preview-caption')}>
              <span className={b.e('preview-name')}>{key(file)} </span>
              {file.size && (
                <span className={b.e('preview-size')}>
                  {fileSize(file.size)}{' '}
                </span>
              )}
              {file.type && (
                <span className={b.e('preview-type')}>{file.type}</span>
              )}
            </figcaption>
          </figure>
        ))}
      </Fragment>
    ) : null
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
                <MdCloudUpload /> {placeholder}
              </Fragment>
            )}
          </div>
        </Dropzone>
        {multiple && preview ? preview : null}
      </div>
    )
  }
}
