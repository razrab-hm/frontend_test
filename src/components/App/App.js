import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import { Register, Login, Main, Admin, NotFound } from '../../pages';
import { ProtectedRoute } from '..';
import ENUMS from '../../constants/appEnums.js';
import Spinner from 'react-bootstrap/Spinner';
import { checkAuthStatus } from '../../utils/projectUtils';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState();
  const [logginMsg, setLogginMsg] = useState('');

  useEffect(() => {
    checkAuthStatus(setUserLoggedIn, setUserRole, setIsLoading);
  },[]);

  return isLoading ? (
    <div className="spinner_wrapper">
      <Spinner variant="primary" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  ) : (
    <>
      <Switch>
        <Route exact path={ENUMS.ROUTES.REGISTER}>
          <Register userLoggedIn={userLoggedIn} />
        </Route>
        <Route exact path={'/'}>
          <Redirect to={{ pathname: ENUMS.ROUTES.LOGIN}} />
        </Route>
        <Route exact path={ENUMS.ROUTES.LOGIN}>
          <Login setUserLoggedIn={setUserLoggedIn} userLoggedIn={userLoggedIn} setLogginMsg={setLogginMsg} setUserRole={setUserRole}/>
        </Route>
        <ProtectedRoute exact path={ENUMS.ROUTES.MAIN} userLoggedIn={userLoggedIn}>
          <Main logginMsg={logginMsg} userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} userRole={userRole}/>
        </ProtectedRoute>
        <ProtectedRoute path={ENUMS.ROUTES.ADMIN} userLoggedIn={userLoggedIn}>
          <Admin userRole={userRole} userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn}/>
        </ProtectedRoute>
        <ProtectedRoute exact path={ENUMS.ROUTES.ADMIN_USERS} userLoggedIn={userLoggedIn}>
          <Admin  setUserRole={setUserRole} userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn}/>
        </ProtectedRoute>
        {/* <ProtectedRoute exact path={ENUMS.ROUTES.ADMIN_USERS_ID} userLoggedIn={userLoggedIn}>
          <Admin userRole={userRole} userLoggedIn={userLoggedIn}/>
        </ProtectedRoute> */}
         <ProtectedRoute exact path={ENUMS.ROUTES.ADMIN_UPLOAD} userLoggedIn={userLoggedIn}>
          <Admin userRole={userRole}/>
        </ProtectedRoute>
        <ProtectedRoute exact path={ENUMS.ROUTES.ADMIN_COMPANIES} userLoggedIn={userLoggedIn}>
          <Admin userRole={userRole}/>
        </ProtectedRoute>
        <Route>
          <NotFound/>
        </Route>
      </Switch>
    </>
  );
}

export default App;
