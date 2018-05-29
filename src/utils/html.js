import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

const fromHTML = html =>
  ContentState.createFromBlockArray(htmlToDraft(html).contentBlocks)

const toHTML = content => draftToHtml(convertToRaw(content))

export const HTMLToEditor = html =>
  EditorState.createWithContent(fromHTML(html))

export const editorToHTML = editorState =>
  toHTML(editorState.getCurrentContent())
