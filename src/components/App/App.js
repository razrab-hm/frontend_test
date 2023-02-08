import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import { Register, Login, Main, Admin, NotFound } from '../../pages';
import { ProtectedRoute } from '..';
import ENUMS from '../../constants/appEnums.js';
import Spinner from 'react-bootstrap/Spinner';
import { checkAuthStatus } from '../../utils/projectUtils';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  // const [activeCompanies, setActiveCompanies] = useState([]);
  // const [userCompanies, setUserCompanies] = useState([]);
  // const [selectedCompanies, setSelectedCompanies] = useState(userCompanies);
  const [userRole, setUserRole] = useState();
  // const location = useLocation();

  // const modalControlsYQ = useModalControls();
 
  // console.log('selectedCompanies', selectedCompanies)

  // console.log('userCompanies', userCompanies)

  // const data = {
  //   accessToken: getCookie('accessToken'),
  //   refreshToken: getCookie('refreshToken')
  // }
  // const checkAuthStatus = async () => {
  //   if (data.accessToken && data.refreshToken) {
  //     setIsLoading(true);
  //     authApi.authStatus(data.accessToken)
  //       .then((res) => {
  //         if(res && res.message === "success") {
  //           setUserLoggedIn(true);
  //           setIsLoading(false);
  //           setUserRole(res.role)
  //         }
  //     })
  //       .catch((error) => {
  //         console.log(error)
  //         setIsLoading(false);
  //         setUserLoggedIn(false);
  //       });
  //   } else {
  //     setUserLoggedIn(false);
  //   }
  // }
 
  // useEffect(() => {
  //   setSelectedCompanies(userCompanies)
  // },[userCompanies])

  useEffect(() => {
    // console.log(1)
    checkAuthStatus(setUserLoggedIn, setUserRole, setIsLoading);
  },[]);


  // useEffect(() => {
  //   // console.log(1)
  //   getData( null, setUserCompanies, api.fetchData, ENUMS.API_ROUTES.COMPANIES_ME);
  // },[userLoggedIn])

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
        <Route exact path={ENUMS.ROUTES.LOGIN}>
          <Login setUserLoggedIn={setUserLoggedIn} userLoggedIn={userLoggedIn}  setUserRole={setUserRole}/>
        </Route>
        <ProtectedRoute exact path={ENUMS.ROUTES.MAIN} userLoggedIn={userLoggedIn}>
          <Main userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} userRole={userRole}/>
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
