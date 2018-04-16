import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import 'draft-js/dist/Draft.css'

import './index.sass'

import block from 'bemboo'
import React from 'react'
import { Editor } from 'react-draft-wysiwyg'

import { readAsBase64 } from '../../utils'

const b = block('HTMLField')

export default class HTMLField extends React.Component {
  onChange(editorState) {
    this.props.onChange({ target: { value: editorState } })
  }

  checkValidity() {
    return true
  }

  render() {
    const {
      value,
      className,
      readOnly,
      onFocus,
      onBlur,
      onKeyDown,
      required,
      toolbar,
    } = this.props
    const HTMLToolbar = toolbar || {
      image: {
        uploadCallback: async file => ({
          data: { link: await readAsBase64(file) },
        }),
        previewImage: true,
        alt: { present: true, mandatory: false },
      },
    }
    return (
      <div className={b.mix(className)}>
        <Editor
          editorClassName={b.e('editor')}
          editorState={value}
          localization={{
            locale: 'fr',
          }}
          onBlur={e => onBlur(e)}
          onEditorStateChange={state => this.onChange(state)}
          onFocus={e => onFocus(e)}
          onKeyDown={e => onKeyDown(e)}
          placeholder="Entrez votre texte ici…"
          readOnly={readOnly}
          required={required}
          toolbar={HTMLToolbar}
          toolbarClassName={b.e('toolbar')}
          wrapperClassName={b.e('wrapper')}
        />
      </div>
    )
  }
}
