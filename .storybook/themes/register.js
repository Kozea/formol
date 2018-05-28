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
    this.iframe.contentWindow.addEventListener(
      'DOMContentLoaded',
      this.initializeIframe
    )
  }

  componentWillUnmount() {
    this.iframe = null
    this.link = null
  }

  initializeIframe() {
    this.iframe.contentWindow.removeEventListener(
      'DOMContentLoaded',
      this.initializeIframe
    )
    const { currentTheme } = this.state
    const links = [
      ...this.iframe.contentDocument.querySelectorAll('head > link'),
    ]
    if (!links.length) {
      this.setState({ devMode: true })
      return
    }
    const themesLinks = links.reduce((themesLink, link) => {
      const name = link.href.replace(
        `${location.origin}${location.pathname}`,
        ''
      )
      themesLink[name] = link
      return themesLink
    }, {})
    if (!Object.keys(themesLinks).includes(currentTheme)) {
      throw new Error(`Unknown theme ${currentTheme}`)
    }
    this.link = themesLinks[currentTheme]
    Object.values(themesLinks)
      .filter(l => l !== this.link)
      .forEach(link => link.parentNode.removeChild(link))
    const themes = Object.keys(themesLinks)
    this.setState({ themes })
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
      <div>
        <label>
          Choose your theme
          <select value={currentTheme} onChange={this.handleThemeChange}>
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
