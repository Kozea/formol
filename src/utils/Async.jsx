import React from 'react'

export default resolve =>
  class AsyncWrapper extends React.PureComponent {
    constructor(props) {
      super(props)
      this._promise = null
      this.state = {
        Component: null,
        error: null,
      }
    }

    componentDidMount() {
      this.unmounted = false
      this._promise = this.resolve()
    }

    componentWillUnmount() {
      this.unmounted = true
    }

    async resolve() {
      try {
        const module = await resolve()
        const Component = module.default
        AsyncWrapper.module = module
        if (!this.unmounted) {
          this.setState({ Component })
        }
      } catch (error) {
        console.error(error)
        if (!this.unmounted) {
          this.setState({ error })
        }
      }
    }

    render() {
      const { Component, error } = this.state
      if (error) {
        return 'Error'
      }
      if (!Component) {
        return 'Loading'
      }
      return <Component {...this.props} />
    }
  }
