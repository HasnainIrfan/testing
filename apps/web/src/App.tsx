import { Provider } from './redux/provider'
import Routing from './routes/Routing'

function App() {
  return (
    <Provider>
      <Routing />
    </Provider>
  )
}

export default App
