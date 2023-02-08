import React, { useState, useEffect, useMemo } from 'react';
import styles from './CompanyInfo.module.css';
import { getData } from '../../../utils/projectUtils';
import { useForm } from "react-hook-form";
import ENUMS from '../../../constants/appEnums';
import { api } from '../../../utils/api';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { adminApi } from '../../../utils/adminApi';
import Spinner from 'react-bootstrap/Spinner';
import { reportsApi } from '../../../utils/reportsApi';

function CompanyInfo({ currentEditCompanyId, loadData }) {

  const [isLoading, setIsLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({});
  const [showToaster, setShowToaster] = useState(false);
  const [toasterText, setToasterText] = useState('');
  const [toasterStyles, setToasterStyles] = useState({});
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [file, setFile] = useState();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset
  } = useForm({
    defaultValues: useMemo(() => {
      return companyInfo;
    }, [companyInfo]),
  });

  const getCompanyInfo = () => {
    getData(null, setCompanyInfo, api.fetchData, `${ENUMS.API_ROUTES.COMPANIES_COMPANY}${currentEditCompanyId}`);
    setDisableSaveBtn(true)
  };

  const handleSaveData = async (parameters) => {
    try {
        setIsLoading(true);
        await adminApi.updateCompany(parameters, ENUMS.API_ROUTES.COMPANIES);
        setToasterText(ENUMS.TOASTER.SUCCESS_UPDATE_COMPANY.label)
        setToasterStyles(ENUMS.TOASTER.SUCCESS_STYLE)
        setIsLoading(false);
        setShowToaster(true);
        loadData();
        setDisableSaveBtn(true)
      } catch (error) {
        console.log(1)
        setIsLoading(false);
        reset();
        if (error.message === 'Username already registered') {
          setError('username', {type: 'custom', message: 'This company name has already registered'})
        }
        if (error.message === 'Email already registered') {
          setError('email', {type: 'custom', message: 'This company email has already registered'})
        }
        setShowToaster(true);
        setToasterText(ENUMS.TOASTER.FAIL.label);
        setToasterStyles(ENUMS.TOASTER.FAIL_STYLE)
      }
    }


    const handleFileChange = (e) => {
      if (e.target.files) {
        setFile(e.target.files[0]);
      }
    };
  
    const handleUploadClick = async (e) => {
      if (!file) {
        return;
      }
      setToasterText("Uploading file...")
      setShowToaster(true);
      try {
        await reportsApi.uploadFile(file, currentEditCompanyId)
        setToasterText(ENUMS.TOASTER.SUCCESS_UPLOAD_FILE.label)
        setToasterStyles(ENUMS.TOASTER.SUCCESS_STYLE)
        setShowToaster(true);

      } catch (error) {
        setToasterText(ENUMS.TOASTER.FAIL.label)
        setToasterStyles(ENUMS.TOASTER.FAIL_STYLE)
        setShowToaster(true);
      }
    };

  useEffect(() => {
    reset(companyInfo);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyInfo]);


  useEffect(() => {
    if (currentEditCompanyId) {
        getCompanyInfo();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEditCompanyId]);

  if (!currentEditCompanyId) return null;
  return isLoading ? (
    <div className="spinner_wrapper">
      <Spinner variant="primary" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  ) : (
    <div className={styles.company_info_container}>
      <h4>Change company data</h4>
      <Form
        onSubmit={handleSubmit(handleSaveData)}
        onChange={() => setDisableSaveBtn(false)}
      >
        <InputGroup className="mb-3">
          <InputGroup.Text id="title">Company name</InputGroup.Text>
          <Form.Control
            {...register('title', {
              required: 'Company name is required',
              minLength: 3,
            })}
            aria-invalid={errors.username ? 'true' : 'false'}
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.title?.message}
        </p>
        <InputGroup className="mb-3">
          <InputGroup.Text id="contact_fio">Contact name</InputGroup.Text>
          <Form.Control
            {...register('contact_fio')}
            aria-invalid={errors.contact_name ? 'true' : 'false'}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="contact_email">Contact email</InputGroup.Text>
          <Form.Control
            type="email"
            {...register('contact_email', {
              required: 'Contact email is required',
            })}
            aria-invalid={errors.contact_email ? 'true' : 'false'}
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.contact_email?.message}
        </p>
        <InputGroup className="mb-3">
          <InputGroup.Text id="contact_phone">Contact phone</InputGroup.Text>
          <Form.Control
            {...register('contact_phone')}
            aria-invalid={errors.contact_phone ? 'true' : 'false'}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="description">Description</InputGroup.Text>
          <Form.Control
            {...register('description')}
            type="tel"
            aria-invalid={errors.company_descr ? 'true' : 'false'}
          />
        </InputGroup>
        <Form.Check
          type="switch"
          //   defaultValue={!getValues('inactive')}
          label={`Inactive`}
        //   value={getValues('inactive')}
          id={`cb_test_1`}
          {...register('inactive')}
        />
         <h4>Upload excel file</h4>
         <div className='d-flex justify-content-between'>
          <Form.Group controlId="formFile" style={{width: '85%'}}>
            <Form.Control onChange={handleFileChange} type="file"/>
          </Form.Group>
          
          <Button onClick={(e) => handleUploadClick(e)}>Upload</Button>

         </div>
          
          
        <div className={styles.company_info_btn_wrapper}>
          <Button
            disabled={disableSaveBtn}
            type="submit"
            variant="success"
            size="s"
          >
            Save
          </Button>
          <Button
            onClick={() => getCompanyInfo()}
            type="submit"
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

export default CompanyInfo;
