import * as React from 'react'

// https://github.com/text-mask/text-mask/issues/427#issuecomment-479945031
const mock = React.forwardRef((props, ref) => {
  const { render, ...otherProps } = props

  return render ? (
    render(ref, { ...otherProps })
  ) : (
    <input ref={ref} {...otherProps} />
  )
})

export default mock
