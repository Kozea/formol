import Async from '../utils/Async'

export default Async(
  () =>
    import(
      /* webpackChunkName: "PasswordField" */
      '../async/PasswordStrengthField'
    )
)
