import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from './components/routing/PrivateRoute';
import Navbar  from './components/layout/Navbar';
import Landing  from './components/layout/Landing';
import Login  from './components/auth/Login';
import Register  from './components/auth/Register';
import './App.css';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
//Redux
import { Provider} from 'react-redux';
import store from './store';
import { loadUser } from './actions/authAction';
import setAuthToken from './utils/setAuthToken';
// const App = () =>{
//   <Fragment>
//     <h1>App</h1>d

//   </Fragment>
// }
if(localStorage.token){
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(()=>{
    store.dispatch(loadUser());
  },[]);
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Fragment>
            <Navbar />
            <Route exact path='/' component={Landing} />
            <section className="container">
              <Alert/>
              <Switch>
                <Route exact path='/register' component={Register} />
                <Route exact path='/login' component={Login} />
                <PrivateRoute exact path='/dashboard' component={Dashboard} />
              </Switch>             
            </section>
          </Fragment>
        </Router>
      </Provider>
    </div>
  );
}


export default App;
