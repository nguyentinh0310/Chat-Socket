import ProtectedRoute from 'components/routing/ProtectedRoute';
import AuthContextProvider from 'app/contexts/AuthContext';
import { Suspense } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Auth from './components/Auth/Auth';
import Chat from './components/Chat';

function App() {
  return (
    <AuthContextProvider>
      <div className="App">
        <Suspense fallback={<div>Loading ...</div>}>
          <Router>
            <Switch>
              <Redirect exact from="/" to="/login" />

              <Route
                exact
                path="/login"
                render={(props) => <Auth {...props} authRoute="login" />}
              />
              <Route
                exact
                path="/register"
                render={(props) => <Auth {...props} authRoute="register" />}
              />
              <ProtectedRoute path="/chat" component={Chat} />
            </Switch>
          </Router>
        </Suspense>
      </div>
    </AuthContextProvider>
  );
}

export default App;
