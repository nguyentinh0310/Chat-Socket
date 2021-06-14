import { Suspense } from 'react';
import './App.css';
import {BrowserRouter as Router ,Route,Redirect,Switch} from 'react-router-dom'
import Chat from './components/Chat';
import Login from './components/Auth/Login'

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading ...</div>}>
        <Router>
            <Switch>
                <Redirect exact from='/' to="/chat"/>

                <Route path="/chat" component={Chat}/>
                <Route path="/login" component={Login}/>

            </Switch>
        </Router>
      </Suspense>
    
    </div>
  );
}

export default App;
