import React, { useEffect, useMemo, useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useForm } from "react-hook-form";
import styles from './UserInfo.module.css';
import { getCurrentLoggedUser, getData } from '../../../utils/projectUtils';
import { api } from '../../../utils/api';
import ENUMS from '../../../constants/appEnums';
import Button from 'react-bootstrap/Button';
import { adminApi } from '../../../utils/adminApi';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ListGroup from 'react-bootstrap/ListGroup';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Spinner from 'react-bootstrap/Spinner';

function UserInfo({ currentEditUserId, loadData, userRole, handleClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [loggedUser, setLoggedUser] = useState({});
  const [showToaster, setShowToaster] = useState(false);
  const [userCompanies, setUserCompanies] = useState([]);
  const [toasterText, setToasterText] = useState('');
  const [toasterStyles, setToasterStyles] = useState({});
  const [showPassword, setShowPassword] = useState(true);
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [showCompanyAdd, setShowCompanyAdd] = useState(false);
  const [allCompanies, setAllCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [disableEdit, setDisableEdit] = useState(true);
  const [toastDelete, setToastDelete] = useState({
    title: false,
    btn: false,
    delay: false
  });

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const handleChange = ({ target: { value } }) => {
    setSearchTerm(value);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    setValue,
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

  const renderTooltip = (title, contact_email, contact_fio) => (
    <Tooltip id="button-tooltip">
     <span>Company name: {title}</span>
     <br/>
     <span>Email: {contact_email}</span>
     <br/>
     <span>Contact name: {contact_fio}</span>
    </Tooltip>
  );

  const getCompanies = () => {
    getData(null, setAllCompanies, api.fetchData, ENUMS.API_ROUTES.COMPANIES);
  };

  const deleteCompany = async (company) => {
    const data = {
      userId: userInfo.id,
      companyId: company.id,
    }
    try {
      await adminApi.toggleCompanyAndUser(data, ENUMS.API_ROUTES.USERS_REMOVE_COMPANY);
    } catch (error) {
      console.error(error);
    }

    setUserCompanies((prevState) =>
      prevState.filter((elem) => elem.id !== company.id)
    );
    setDisableSaveBtn(false);
  };

  const addCompany = async (company) => {
    const data = {
      userId: userInfo.id,
      companyId: company.id,
    }
    try {
      await adminApi.toggleCompanyAndUser(data, ENUMS.API_ROUTES.USERS_ADD_COMPANY);
    } catch (error) {
      console.error(error);
    }

    setUserCompanies((prevState) => {return [...prevState, company]});
    setDisableSaveBtn(false);
  };

  const saveData = async (parameters) => {
    if(!parameters.admin && !parameters.manager && !parameters.superadmin) {
       setShowToaster(true);
       setToasterText('Please select user role!');
       setToasterStyles(ENUMS.TOASTER.FAIL_STYLE);
       return
    }

    try {
      setIsLoading(true);
      await adminApi.updateUserInfo(parameters, ENUMS.API_ROUTES.USERS);
      setToasterText(ENUMS.TOASTER.SUCCESS_UPDATE_USER.label);
      setToasterStyles(ENUMS.TOASTER.SUCCESS_STYLE);
      setIsLoading(false);   
      setShowToaster(true);
      setDisableSaveBtn(true);
      setValue('password', '');
      loadData();
    } catch (error) {
      setIsLoading(false);
      reset();
      setToasterStyles(ENUMS.TOASTER.FAIL_STYLE);
      if (error.message === 'User already exists') {
        setError('username', {
          type: 'custom',
          message: `User name '${parameters.username}' has already exists`,
        });
      } else if (error.message === 'Email already exists') {
        setError('email', {
          type: 'custom',
          message: `Email '${parameters.email}' has already exists`,
        });
      } else if (error.message === 'Email is not valid') {
        setError('email', {
          type: 'custom',
          message: `Email '${parameters.email}' is not valid`,
        });
      } else {
        setShowToaster(true);
        setToasterText(error.message);
      }
    }
  };

  const handleChangeRole = (role) => {
    switch (role) {
      case ENUMS.ROLE.MANAGER:
        setValue(ENUMS.ROLE.ADMIN, false)
        setValue(ENUMS.ROLE.SUPERADMIN, false);
        break;
        case ENUMS.ROLE.ADMIN:
          setValue(ENUMS.ROLE.MANAGER, false)
          setValue(ENUMS.ROLE.SUPERADMIN, false);
        break;
        case ENUMS.ROLE.ROOT:
          setValue(ENUMS.ROLE.MANAGER, false)
          setValue(ENUMS.ROLE.ADMIN, false);
        break;
      default: return
      }
  };

  const handleDeleteUser = async (id) => {
    setShowToaster(false);
    setToastDelete({
      title: true,
      btn: false,
      delay: false
    });
    try {
      const response = await adminApi.deleteUser(`${ENUMS.API_ROUTES.USERS_REMOVE}${id}`);
      if (response.detail === 'success') {
        setToasterStyles(ENUMS.TOASTER.SUCCESS_STYLE);
        setToasterText(ENUMS.TOASTER.SUCCESS_DELETE_DATA.label);
        setShowToaster(true);
        loadData();
      }
    } catch (error) {
      setToasterStyles(ENUMS.TOASTER.FAIL_STYLE);
      setToasterText(ENUMS.TOASTER.FAIL.label);
      console.error(error);
      setShowToaster(true);
    };
  }

  const handleShowToastDeleteUser = () => {
    setShowToaster(true);
    setToastDelete({
      title: true,
      btn: true,
      delay: true
    });
    setToasterText(`Do you want to delete this ${userInfo.username} user?`);
  }

  const onCloseToast = () => {
    if (toastDelete.title && !toastDelete.btn) {
      setToastDelete({
        title: false,
        btn: false,
        delay: false
      });
      setToasterStyles({});
      handleClose();
    }
    setShowToaster(false);
  }

  useEffect(() => {
    reset(userInfo);
    setValue('password', '');
    userInfo.superadmin = userInfo.role === ENUMS.ROLE.ROOT ? true : false;
    userInfo.admin = userInfo.role === ENUMS.ROLE.ADMIN ? true : false;
    userInfo.manager = userInfo.role === ENUMS.ROLE.MANAGER ? true : false;
    userInfo.active = !userInfo.inactive;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  useEffect(() => {
    if (currentEditUserId) {
      getUserInfo();
      getCurrentLoggedUser(setLoggedUser);
      getCompanies();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEditUserId]);

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
          <InputGroup.Text id="user_name">
            User name <span style={{ color: 'red' }}>*</span>
          </InputGroup.Text>
          <Form.Control
                {...register('username', {
                  required: 'User name is required',
                  minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters'
                  },
                  maxLength:
                  {
                    value: 30,
                    message: 'Name must not exceed 30 characters'
                  }
                })}
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
          <InputGroup.Text id="email">
            Email address <span style={{ marginLeft: 8, color: 'red' }}>*</span>
          </InputGroup.Text>
          <Form.Control
            type="email"
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.email?.message}
        </p>
        {userCompanies.length === 0 ? (
          <div className={styles.user_info_comments_wrapper}>
            <h4>Comments during registration</h4>
            <p>{userInfo?.description ? userInfo?.description : 'Empty'}</p>
          </div>
        ) : null}

        {showCompanyAdd ? (
          <>
            <div className={styles.user_info_companies_wrapper}>
              <h4>Connect companies</h4>
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
                maxHeight: '130px',
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
                  <OverlayTrigger
                    key={elem.title}
                    placement="left"
                    delay={{ show: 50, hide: 50 }}
                    overlay={renderTooltip(
                      elem.title,
                      elem.contact_email,
                      elem.contact_fio
                    )}
                  >
                    <ListGroup.Item
                      className={styles.user_info_company_add}
                      key={elem.title}
                    >
                      <img
                        onClick={() => addCompany(elem)}
                        className={styles.add_icon_green}
                        alt="add_icon"
                      ></img>
                      {elem.title}
                      {elem.inactive ? (
                        <span style={{ marginLeft: 5, color: '#ff9999' }}>
                          (inactive)
                        </span>
                      ) : null}
                    </ListGroup.Item>
                  </OverlayTrigger>
                ))}
            </ListGroup>
          </>
        ) : (
          <>
            <div className={styles.user_info_companies_wrapper}>
              <h4>Connected companies</h4>
              <Button size="sm" onClick={() => setShowCompanyAdd(true)}>
                <img className={styles.add_icon} alt="plus"></img>
                Connect company
              </Button>
              {userCompanies.length > 0 ? (
                <Button
                  onClick={() => setDisableEdit(!disableEdit)}
                  variant="outline-danger"
                >
                  {disableEdit ? 'Enable editing' : 'Disable editing'}
                </Button>
              ) : null}
            </div>
            {userCompanies.length > 0 ? (
              <div className={styles.user_info_check_wrapper}>
                <ListGroup>
                  {userCompanies.map((elem) => (
                    <OverlayTrigger
                      key={elem.title}
                      placement="left"
                      delay={{ show: 50, hide: 50 }}
                      overlay={renderTooltip(
                        elem.title,
                        elem.contact_email,
                        elem.contact_fio
                      )}
                    >
                      <ListGroup.Item
                        className={styles.user_info_company_add}
                        key={elem.id}
                      >
                        {elem.title}
                        {elem.inactive ? (
                          <span style={{ marginLeft: 5, color: '#ff9999' }}>
                            (inactive)
                          </span>
                        ) : null}
                        {!disableEdit ? (
                          <img
                            disabled={disableEdit}
                            onClick={() => deleteCompany(elem)}
                            className={styles.delete_icon}
                            alt="delete"
                          ></img>
                        ) : null}
                      </ListGroup.Item>
                    </OverlayTrigger>
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
          style={{ paddingLeft: '2.8em' }}
          {...register('active')}
          type="switch"
          label={`Active (User will be treated as active)`}
          id={`active`}
        />
        <div className={styles.user_info_permissions_check_wrapper}>
          <Form.Check
            style={{ paddingLeft: '2.8em' }}
            {...register('manager')}
            onChange={() => handleChangeRole(ENUMS.ROLE.MANAGER)}
            type="switch"
            id={`manager`}
          />

          <div>Manager</div>
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id={`tooltip-manager`}>
                User can see only reports. (Default role)
              </Tooltip>
            }
          >
            <img className={styles.question_icon} alt="question"></img>
          </OverlayTrigger>
        </div>

        <div className={styles.user_info_permissions_check_wrapper}>
          <Form.Check
            style={{ paddingLeft: '2.8em' }}
            {...register('admin')}
            onChange={() => handleChangeRole(ENUMS.ROLE.ADMIN)}
            type="switch"
            id={`admin`}
          />
          <div>Admin</div>
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id={`tooltip-admin`}>
                User can see reports, log in to admin panel and manage his
                companies and users.
              </Tooltip>
            }
          >
            <img className={styles.question_icon} alt="question"></img>
          </OverlayTrigger>
        </div>

        {userRole === ENUMS.ROLE.ROOT ? (
          <div className={styles.user_info_permissions_check_wrapper}>
            <Form.Check
              style={{ paddingLeft: '2.8em' }}
              {...register('superadmin')}
              onChange={() => handleChangeRole(ENUMS.ROLE.ROOT)}
              type="switch"
              id={`superadmin`}
            />
            <div>Superadmin</div>
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id={`tooltip-superadmin`}>
                  User has all permissions and can see all reports.
                </Tooltip>
              }
            >
              <img className={styles.question_icon} alt="question"></img>
            </OverlayTrigger>
          </div>
        ) : (
          ''
        )}

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
          {userRole === ENUMS.ROLE.ROOT && userInfo.id !== loggedUser.id ? <Button
            onClick={handleShowToastDeleteUser}
            variant="primary"
            size="s"
          >
            Delete user
          </Button> : null}
        </div>
        {!disableSaveBtn && (
          <p className={styles.saving_notification}>
            For saving changes press "Save" if you want cancel press "Cancel
            changes"
          </p>
        )}
      </Form>
      <Row>
        <Col xs={6}>
          <ToastContainer position="middle-center" className="p-3">
            <Toast
              style={{ width: 500, height: 150 }}
              onClose={onCloseToast}
              show={showToaster}
              delay={toastDelete.delay ? 15000 : 5000}
              autohide
            >
              <Toast.Header>
                {toastDelete.title ? 'Delete user' : 'Change user data'}
              </Toast.Header>
              <Toast.Body>
                <strong style={toasterStyles} className="me-auto">
                  {toasterText}
                  {toastDelete.btn &&
                  <Button
                    style={{ position: 'absolute', right: 110, bottom: 30 }}
                    variant="primary"
                    onClick={() => handleDeleteUser(userInfo.id)}
                  >
                    Delete
                  </Button>}
                  <Button
                    style={{ position: 'absolute', right: 30, bottom: 30 }}
                    variant="secondary"
                    onClick={onCloseToast}
                  >
                    Close
                  </Button>
                </strong>
              </Toast.Body>
            </Toast>
          </ToastContainer>
        </Col>
      </Row>
    </div>
  );
}

export default UserInfo