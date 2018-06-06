import React from 'react'

export default (resolve, options) => {
  const { path, Loading, Error } = options || {}

  return class AsyncWrapper extends React.PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        Component: null,
        error: null,
      }
    }

    componentDidMount() {
      this.unmounted = false
      const { Component } = this.state
      if (!Component) {
        this.resolve()
      }
    }

    componentWillUnmount() {
      this.unmounted = true
    }

    componentDidCatch(error, info) {
      this.setState({ error })
      console.error(error, info)
    }

    async resolve() {
      try {
        const module = await resolve()
        const Component = path ? module[path] : module.default || module
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
        return Error ? <Error error={error} /> : 'Error'
      }
      if (!Component) {
        return Loading ? <Loading /> : 'Loading'
      }
      return <Component {...this.props} />
    }
  }
}
