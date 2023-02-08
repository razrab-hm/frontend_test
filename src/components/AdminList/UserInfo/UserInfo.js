import React, { useEffect, useMemo, useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useForm } from "react-hook-form";
import styles from './UserInfo.module.css';
import { getData } from '../../../utils/projectUtils';
import { api } from '../../../utils/api';
import ENUMS from '../../../constants/appEnums';
import Button from 'react-bootstrap/Button';
import { adminApi } from '../../../utils/adminApi';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';


function UserInfo({ currentEditUserId, loadData, userRole }) {

  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [showToaster, setShowToaster] = useState(false);
  const [userCompanies, setUserCompanies] = useState([]);
  const [toasterText, setToasterText] = useState('');
  const [toasterStyles, setToasterStyles] = useState({});
  const [showPassword, setShowPassword] = useState(true);
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [showCompanyAdd, setShowCompanyAdd] = useState(false);
  const [allCompanies, setAllCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleChange = ({ target: { value } }) => {
    setSearchTerm(value);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError
  } = useForm({
    defaultValues: useMemo(() => {
      return userInfo;
    }, [userInfo]),
  });

  const getUserInfo = () => {
    getData(
      null,
      setUserInfo,
      api.fetchData,
      `${ENUMS.API_ROUTES.USERS}${currentEditUserId}`
    );
    getData(
      null,
      setUserCompanies,
      api.fetchData,
      `${ENUMS.API_ROUTES.COMPANIES_USER}${currentEditUserId}`
    );
  };

  const getCompanies = () => {
    getData(null, setAllCompanies, api.fetchData, ENUMS.API_ROUTES.COMPANIES);
  };

  const deleteCompany = (company) => {
    setUserCompanies((prevState) =>
      prevState.filter((elem) => elem.id !== company.id)
    );
    setDisableSaveBtn(false);
  };

  const addCompany = (company) => {
    console.log(company)
    setUserCompanies((prevState) => {return [...prevState, company]});
    console.log('userCompanies', userCompanies)
    setDisableSaveBtn(false);
  };

  const saveData = async (parameters) => {
    const userNewCompanies = {companies_id: userCompanies.map(elem => elem.id), user_id: parameters.id}
    try {
      setIsLoading(true);
      await adminApi.updateUserInfo(parameters, ENUMS.API_ROUTES.USERS);
      await adminApi.updateUserInfo(userNewCompanies, ENUMS.API_ROUTES.USERS_UPDATE_COMPANIES);
      setToasterText(ENUMS.TOASTER.SUCCESS_UPDATE_USER.label);
      setToasterStyles(ENUMS.TOASTER.SUCCESS_STYLE);
      setIsLoading(false);
      setShowToaster(true);
      setDisableSaveBtn(true);
      loadData();
    } catch (error) {
      setIsLoading(false);
      reset();
      setShowToaster(true);
      setToasterText(ENUMS.TOASTER.FAIL.label);
      setToasterStyles(ENUMS.TOASTER.FAIL_STYLE);
      if (error.message === 'User already exists') {
        setError('username', {
          type: 'custom',
          message: `User name '${parameters.username}' has already exists`,
        });
      }
      if (error.message === 'Email already exists') {
        setError('email', {
          type: 'custom',
          message: `Email '${parameters.email}' has already exists`,
        });
      }
    
    }
  };

  useEffect(() => {
    reset(userInfo);
    userInfo.superadmin = userInfo.role === 'root' ? true : false;
    userInfo.admin = userInfo.role === 'admin' ? true : false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  // useEffect(() => {
  //   setSelectedCompanies(userCompanies);
  // }, [userCompanies]);

  useEffect(() => {
    if (currentEditUserId) {
      getUserInfo();
    }
    getCompanies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEditUserId]);

  if (!currentEditUserId) return null;

  return isLoading ? (
    <div className="spinner_wrapper">
      <Spinner variant="primary" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  ) : (
    <div className={styles.user_info_wrapper}>
      <h4>Change user data</h4>
      <Form
        onSubmit={handleSubmit(saveData)}
        onChange={() => setDisableSaveBtn(false)}
      >
        <InputGroup className="mb-3">
          <InputGroup.Text id="user_name">User name</InputGroup.Text>
          <Form.Control
            {...register('username', { required: true })}
            aria-invalid={errors.username ? 'true' : 'false'}
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.username?.message}
        </p>
        <Button onClick={toggleShowPassword} className="mb-2 btn-secondary">
          Reset password
        </Button>
        <InputGroup
          style={{ display: showPassword ? 'none' : '' }}
          className="mb-3"
        >
          <InputGroup.Text id="password">New password</InputGroup.Text>
          <Form.Control
            disabled={showPassword}
            {...register('password')}
            aria-invalid={errors.username ? 'true' : 'false'}
          />
        </InputGroup>
        <h4>Personal Info</h4>
        <InputGroup className="mb-3">
          <InputGroup.Text id="first_name">First name</InputGroup.Text>
          <Form.Control
            {...register('first_name')}
            aria-invalid={errors.firstName ? 'true' : 'false'}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="last_name">Last name</InputGroup.Text>
          <Form.Control
            {...register('last_name')}
            aria-invalid={errors.lastName ? 'true' : 'false'}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="email">Email address</InputGroup.Text>
          <Form.Control
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.email?.message}
        </p>
        {showCompanyAdd ? (
          <>
            <div className={styles.user_info_companies_wrapper}>
              <h4>Set companies for user</h4>
              <Button size="sm" onClick={() => setShowCompanyAdd(false)}>
                <img className={styles.arrow_icon} alt="back"></img>
                Go back
              </Button>
            </div>
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: 40 }} id="user_name_search">
                <img className={styles.search_icon} alt="search" />
              </InputGroup.Text>
              <Form.Control
                placeholder={`Company name`}
                onChange={handleChange}
              />
            </InputGroup>
            <ListGroup
              style={{
                height: '130px',
                boxSizing: 'border-box',
                overflow: 'scroll',
              }}
            >
              {allCompanies
                .filter(
                  ({ id: id1 }) =>
                    !userCompanies.some(({ id: id2 }) => id2 === id1)
                )
                .filter((elem) => elem.title.toLowerCase().includes(searchTerm))
                .map((elem) => (
                  <ListGroup.Item
                    className={styles.user_info_company_add}
                    key={elem.title}
                    onClick={() => addCompany(elem)}
                  >
                    <img className={styles.add_icon_green} alt="add_icon"></img>
                    {elem.title}
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </>
        ) : (
          <>
            <div className={styles.user_info_companies_wrapper}>
              <h4>User companies</h4>
              <Button size="sm" onClick={() => setShowCompanyAdd(true)}>
                <img className={styles.add_icon} alt="plus"></img>
                Add company
              </Button>
            </div>
            {userCompanies.length > 0 ? (
              <div className={styles.user_info_check_wrapper}>
                <ListGroup>
                  {userCompanies.map((elem) => (
                    <ListGroup.Item className={styles.user_info_company_add} key={elem.id}>
                      {elem.title}
                      <img
                        onClick={() => deleteCompany(elem)}
                        className={styles.delete_icon}
                        alt="delete"
                      ></img>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            ) : (
              <div key={'empty'}>Empty</div>
            )}
          </>
        )}

        <h4>Permissions</h4>
        <Form.Check
          {...register('inactive')}
          type="switch"
          label={`Inactive (User will be treated as inactive)`}
          id={`inactive`}
        />
        <Form.Check
          {...register('admin')}
          type="switch"
          label={`Staff status (User can log into this admin site)`}
          id={`admin`}
        />
        {
          userRole === ENUMS.ROLE.SUPERADMIN ?
          <Form.Check
          {...register('superadmin')}
          type="switch"
          label={`Superuser status (User has all permissions)`}
          id={`root`}
        />
        : ''
        }
        
        <div className={styles.user_info_btn_wrapper}>
          <Button
            disabled={disableSaveBtn}
            type="submit"
            variant="success"
            size="s"
          >
            Save
          </Button>
          <Button
            onClick={() => {
              getUserInfo();
              setDisableSaveBtn(true);
            }}
            variant="primary"
            size="s"
          >
            Cancel changes
          </Button>
        </div>
      </Form>
      <Row>
        <Col xs={6}>
          <ToastContainer position="top-end" className="p-3">
            <Toast
              onClose={() => setShowToaster(false)}
              show={showToaster}
              delay={5000}
              autohide
            >
              <Toast.Header style={toasterStyles}>
                <strong className="me-auto">{toasterText}</strong>
              </Toast.Header>
              <Toast.Body></Toast.Body>
            </Toast>
          </ToastContainer>
        </Col>
      </Row>
    </div>
  );
}

export default UserInfo