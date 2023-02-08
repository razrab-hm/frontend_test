import React from 'react';
import styles from './NoCompanies.module.css';
import {getCookie} from '../../utils/cookie';
import { authApi } from '../../utils/authApi';
import { useHistory } from 'react-router-dom';


function NoCompanies({setUserLoggedIn}) {

    const refreshToken = getCookie('accessToken');
    const history = useHistory();

    const handleLogout = () => {
        authApi.logout(refreshToken)
        .then((res) => {
          setUserLoggedIn(false);
          history.replace('/login')
        })
        .catch((error) => {
          console.log(error)
        })
      };


  return (
    <div className={styles.no_companies_wrapper}>
        <h4>Sorry, you don't have any active companies.</h4>
        <h4>Please contact with administrator</h4>
        <div className={styles.no_companies_link} onClick={handleLogout}>Go back to login</div>
    </div>
  )
}

export default NoCompanies