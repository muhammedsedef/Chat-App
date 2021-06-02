import './App.css';
import Login from './assets/Login/Login'
import Register from './assets/Register/Register'
import Logs from './assets/Logs/Logs'
import Chat from './assets/Chat/Chat'
import ConversationCard from './components/ConversationCard/ConversationCard'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  
  //Remove after auth function.
  const auth = false

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={auth ? Chat : Login}/>
          <Route path="/register" exact component={Register}/>
          <Route path="/test" exact component={ConversationCard}/>
          <Route path="/chat" exact component={Chat}/>
          <Route path="/logs" exact component={Logs}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
