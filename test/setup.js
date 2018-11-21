import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import regeneratorRuntime from 'regenerator-runtime'

global.regeneratorRuntime = regeneratorRuntime
configure({ adapter: new Adapter() })
