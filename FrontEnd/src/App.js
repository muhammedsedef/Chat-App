import './App.css';
import Login from './assets/Login/Login'
import Register from './assets/Register/Register'
import Logs from './assets/Logs/Logs'
import Chat from './assets/Chat/Chat'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedLogs from './components/ProtectedLogs'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  
  //Remove after auth function.
  const auth = false

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Login}/>
          <Route path="/register" exact component={Register}/>
          <ProtectedRoute path="/chat" exact component={Chat}/>
          <ProtectedLogs path="/logs" exact component={Logs}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
