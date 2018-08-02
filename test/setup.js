import { defaultSettings } from 'bemboo'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

defaultSettings.cache = false
configure({ adapter: new Adapter() })
