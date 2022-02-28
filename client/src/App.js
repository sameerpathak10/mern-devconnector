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
import Profile from './components/profile-forms/Profile';
import EditProfile from './components/profile-forms/EditProfile';
import Experience from './components/profile-forms/AddExperience';
import Education from './components/profile-forms/AddEducation';

//Redux
import { Provider} from 'react-redux';
import store from './store';
import { loadUser } from './actions/authAction';
import setAuthToken from './utils/setAuthToken';
import { LOGOUT } from './actions/types';


const App =()=> {
  useEffect(()=>{
    // check for token in LS
    if(localStorage.token){
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());

    //log user out from all tabs if they log out in one tab
    window.addEventListener('storage',()=>{
      if(!localStorage.token) store.dispatch({ type:LOGOUT });
    });
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
                <PrivateRoute exact path='/createProfile' component={Profile} />
                <PrivateRoute exact path='/editProfile' component={EditProfile} />
                <PrivateRoute exact path="/addExperience" component={Experience} />
                <PrivateRoute exact path="/addEducation" component={Education} />
                {/* <PrivateRoute exact path="/posts" component={Posts} />
                <PrivateRoute exact path="/posts/:id" component={Post} /> */}
              </Switch>             
            </section>
          </Fragment>
        </Router>
      </Provider>
    </div>
  );
}


export default App;
