import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

export const stateFromValue = value => {
  if (!value) {
    return EditorState.createEmpty()
  }
  const contentBlock = htmlToDraft(value)
  const editorContent = EditorState.createWithContent(
    ContentState.createFromBlockArray(contentBlock.contentBlocks)
  )
  const contentToHtml = draftToHtml(
    convertToRaw(editorContent.getCurrentContent())
  )
  if (emptyContent(contentToHtml)) {
    return EditorState.createEmpty()
  }
  return editorContent
}

const fix = html => html.replace(/href="www\./, 'href="http://www.')

export const emptyContent = htmlContent =>
  !htmlContent.replace('\n', '').replace(/<[^>]*>/g, '').length

export const stateToValue = editorState =>
  fix(draftToHtml(convertToRaw(editorState.getCurrentContent())))

export const isStateEqual = (old, mew) =>
  // Would be better to avoid html conversion
  stateToValue(old) === stateToValue(mew)
