import Columns from './Columns'

import { store } from './redux/store'
import { Provider } from 'react-redux'

function App() {

  return <Provider store={store}>
    <Columns /></Provider>
}

export default App;
