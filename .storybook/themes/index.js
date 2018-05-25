import addons from '@storybook/addons'
import React from 'react'

export class WithNotes extends React.Component {
  render() {
    const { children, notes } = this.props
    const channel = addons.getChannel()

    // send the notes to the channel.
    channel.emit('kadira/notes/add_notes', notes)
    // return children elements.
    return children
  }
}
