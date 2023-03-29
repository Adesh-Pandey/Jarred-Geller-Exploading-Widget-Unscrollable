import Columns from './Columns'
import { useState } from "react"
import { store } from './redux/store'
import { Provider } from 'react-redux'

function App() {

  const [AddButton, setAddButton] = useState(true);
  const [RemoveButton, setRemoveButton] = useState(true)
  const [HighlightButton, setHighlightButton] = useState(true);
  const [TokenCountLabel, setTokenCountLabel] = useState(true);
  const [ToggleColumnDisable, setToggleColumnDisable] = useState(true);
  const [AddRemoveToken, setAddRemoveToken] = useState(true);
  const [ChangeBase, setChangeBase] = useState(true);
  const [Restart, setRestart] = useState(true);
  const [ColumnOrderReverse, setColumnOrderReverse] = useState(true);
  const [ShowTokenLabelButton, setShowTokenLabelButton] = useState(true);
  const [ColumnTotalValue, setColumnTotalValue] = useState(true);


  return <Provider store={store}>
    <Columns AddButton={AddButton}
      ToggleColumnDisable={ToggleColumnDisable}
      RemoveButton={RemoveButton}
      HighLightButton={HighlightButton}
      TokenCountLabel={TokenCountLabel}
      AddRemoveToken={AddRemoveToken}
      ChangeBase={ChangeBase}
      Restart={Restart}
      ColumnOrderReverse={ColumnOrderReverse}
      ShowTokenLabelButton={ShowTokenLabelButton}
      ColumnTotalValue={ColumnTotalValue} /> </Provider>
}

export default App;
