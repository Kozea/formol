import { ContentState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

export const fromHTML = html =>
  ContentState.createFromBlockArray(htmlToDraft(html).contentBlocks)

export const toHTML = content => draftToHtml(convertToRaw(content))
