import React from 'react'
import styles from './Dashboard.module.css';
import Container from 'react-bootstrap/Container';
import { useHistory } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { authApi } from '../../utils/authApi';
import {getCookie} from '../../utils/cookie';
import ENUMS from '../../constants/appEnums';
import { Form } from 'react-bootstrap';

function Dashboard({setUserLoggedIn, adminPanel, userRole, userCompanies, setSelectedCompanies, selectedCompanies}) {

  const switchCompany = (id) => {
    if(selectedCompanies.find(elem => elem.id === id)) {
      setSelectedCompanies(selectedCompanies.filter(elem => elem.id !== id))
    } else {
      setSelectedCompanies([...selectedCompanies, userCompanies.find(elem => elem.id === id)]) 
    }
  };

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
    <header className="header header-sticky mb-0">
      <Navbar variant="light" expand="lg">
        <Container fluid style={{ height: 40 }}>
          <Navbar.Brand>
            <DropdownButton
              title={<div className={adminPanel ? '' : styles.nav_list}></div>}
            >
              <Form>
                {
                userCompanies?.length > 0 ?
                userCompanies.map((elem, i) => (
                  <div key={elem.id}>
                    <Form.Check
                      onClick={() => switchCompany(elem.id)}
                      style={{ marginLeft: 10 }}
                      defaultChecked={
                        userCompanies[i] === selectedCompanies[i] || false
                      }
                      type="checkbox"
                      label={`${elem.title}`}
                      id={`${elem.title}`}
                    />
                  </div>
                ))
                    :
                  <div style={{textAlign: 'center'}}>Empty</div>
              }
              </Form>
            </DropdownButton>

            {/* <div className={adminPanel ? '' : styles.nav_list}></div> */}
          </Navbar.Brand>
          <Navbar.Brand>
            <div
              style={{
                color: 'rgba(44, 56, 74, 0.681)',
                fontWeight: 'bolder',
                fontSize: '1rem',
              }}
            >
              {' '}
              {adminPanel ? 'Admin Panel' : 'Dashboard'}
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <DropdownButton
            align={{ lg: 'end' }}
            title={<div className={styles.nav_user}></div>}
            id="dropdown"
          >
            {userRole !== ENUMS.ROLE.MANAGER ? (
              adminPanel ? (
                <Dropdown.Item
                  eventKey="1"
                  onClick={() => history.push('/main')}
                >
                  <img className={styles.link_main} alt="main" />
                  Dashboard
                </Dropdown.Item>
              ) : (
                <Dropdown.Item
                  eventKey="2"
                  onClick={() => history.push('/admin')}
                >
                  <img className={styles.link_admin} alt="admin" />
                  Admin Panel
                </Dropdown.Item>
              )
            ) : null}

            <Dropdown.Item eventKey="2" onClick={() => handleLogout()}>
              <img className={styles.logout} alt="admin" />
              Logout
            </Dropdown.Item>
          </DropdownButton>
        </Container>
      </Navbar>
    </header>
  );
}

export default Dashboard