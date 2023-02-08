import React, {useEffect, useState} from 'react';
import styles from './AdminList.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import { getData } from '../../utils/projectUtils';
// import { useHistory } from 'react-router-dom';
import { api } from '../../utils/api';
import ENUMS from '../../constants/appEnums';
import { UserInfo, CompanyInfo, AdminAddForm } from '..';



function AdminUsers({header, usage, userRole}) {
  const [allUsers, setAllUsers] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [currentEditUser, setCurrentEditUser] = useState();
  const [currentEditCompany, setCurrentEditCompany] = useState();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChange = ({ target: { value } }) => {
    setSearchTerm(value);
  };

  const toggleShowAddForm = () => setShowAddForm(!showAddForm);

  useEffect(() => {
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = () => {
    if(usage === ENUMS.USAGE.USERS) getData(null, setAllUsers, api.fetchData, ENUMS.API_ROUTES.USERS);
    if(usage === ENUMS.USAGE.COMPANIES) getData(null, setAllCompanies, api.fetchData, ENUMS.API_ROUTES.COMPANIES);
  };

  const filterNames = () => {
    if (usage === ENUMS.USAGE.USERS) {
      return allUsers
        .filter((user) => user?.username?.toLowerCase().includes(searchTerm))
        .map((elem) => (
          <ListGroup.Item
            key={elem.username}
            onClick={() => {
              setCurrentEditUser(elem);
              setShowAddForm(false);
            }}
            action
          >
            {elem.username}
          </ListGroup.Item>
        ));
    } else if(usage === ENUMS.USAGE.COMPANIES) {
      return (
        allCompanies
          .filter((elem) => elem.title.toLowerCase().includes(searchTerm))
          .map((elem) => (
            <ListGroup.Item
              key={elem.title}
              onClick={() => {
                setCurrentEditCompany(elem)
                setShowAddForm(false)
              }}
              action
            >
              {elem.title}
            </ListGroup.Item>
          ))
      )
    }
    
   
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-xl-6">
          <h4>{header}</h4>
          <Form>
            <InputGroup className="mb-3">
              <InputGroup.Text id="user_name_search">
                <img className={styles.search_icon} alt="search" />
              </InputGroup.Text>
              <Form.Control
                placeholder={`${usage} name`}
                onChange={handleChange}
              />
            </InputGroup>
            <div>
              <Button
                disabled={userRole !== ENUMS.ROLE.SUPERADMIN && usage ===  ENUMS.USAGE.COMPANIES? true : false} 
                className={styles.admin_list_add_btn}
                onClick={toggleShowAddForm}
              >
                <img className={styles.admin_list_plus} alt="plus" />
                Add {usage}
              </Button>
            </div>
          </Form>
          <ListGroup style={{
              height: 'calc(100vh - 250px)',
              boxSizing: 'border-box',
              overflow: 'scroll',
            }}>{filterNames()}</ListGroup>
          <div className={styles.admin_user_btns_wrapper}>
          </div>
        </div>
        <div className="col-xl-6">
          {showAddForm ? (
            <AdminAddForm
              header={`Add ${usage}`}
              usage={usage}
              loadData={loadData}
            />
          ) : (
            <>
              <UserInfo currentEditUserId={currentEditUser?.id} loadData={loadData} userRole={userRole}/>
              <CompanyInfo currentEditCompanyId={currentEditCompany?.id} loadData={loadData}/>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers