import addons from '@storybook/addons'
import React from 'react'

class Themes extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      currentTheme: 'default.css',
      themes: ['default.css'],
      devMode: false,
    }
    this.handleThemeChange = this.handleThemeChange.bind(this)
    this.initializeIframe = this.initializeIframe.bind(this)
  }

  componentDidMount() {
    const { api } = this.props
    this.iframe = document.getElementById('storybook-preview-iframe')
    this.iframe.contentWindow.addEventListener('load', this.initializeIframe)
  }

  componentWillUnmount() {
    this.iframe = null
    this.link = null
  }

  initializeIframe() {
    this.iframe.contentWindow.removeEventListener('load', this.initializeIframe)
    this.link = this.iframe.contentDocument.getElementById('current-theme')
    this.setState({ themes: this.iframe.contentWindow.themes })
  }

  handleThemeChange({ target: { value } }) {
    this.link.href = `${location.origin}${location.pathname}${value}`
    this.setState({ currentTheme: value })
  }

  render() {
    const { currentTheme, themes, devMode } = this.state
    if (devMode) {
      return 'Currently running in dev mode, no themes available.'
    }
    return (
      <div style={{ display: 'flex', flex: 1 }}>
        <label
          style={{
            padding: '15px',
            fontSize: '12px',
            color: 'rgb(68, 68, 68)',
            fontWeight: 600,
          }}
        >
          Choose your theme
          <select
            value={currentTheme}
            onChange={this.handleThemeChange}
            style={{
              outline: 'none',
              border: '1px solid #f7f4f4',
              borderRadius: '2px',
              fontSize: '11px',
              margin: '5px',
              padding: '5px',
              color: '#555',
            }}
          >
            {themes.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>
    )
  }
}

addons.register('formol/themes', api => {
  addons.addPanel('formol/themes/panel', {
    title: 'Themes',
    render: () => <Themes api={api} />,
  })
})
