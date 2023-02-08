import axios from "../axiosConfig";
import { getCookie } from "./cookie";


export const reportsApi = {
    getReport: async (data, url, pdf, xlsx) => {
      try {
        const response = await axios.post(url,
          {
            year: data.year,
            month: data.month,
            quarter: data.quarter,
            companies: data.companies,
            output_type: pdf ? 'pdf' : xlsx ? 'xlsx' : 'json'
          },
          {  headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('accessToken')}`,
        }, },
        );
        if (response.status === 200 && response.data) return response.data;
        throw new Error(`Response status code: ${response.status}`);
      } catch (error) {
        if (error.response.status === 403) throw new Error("Empty companies");
        throw new Error(error.message);
      }
    },
    getXlsxReport: async (data) => {
      try {
        const response = await fetch('http://127.0.0.1:8000/reports/year_quarter',
          {
            method: 'POST',
            body: JSON.stringify({...data, output_type: 'xlsx'}),
            headers: {
              'Authorization': `Bearer ${getCookie('accessToken')}`,
              'Content-Type': 'application/json',
            }
          }
        );
        if (response.status === 200) return response;
        throw new Error(`Response status code: ${response.status}`);
      } catch (error) {
        if (error.response.status === 403) throw new Error("Error during downloading file");
        throw new Error(error.message);
      }
    },
    uploadFile:  async (file, currentEditCompanyId) => {
      const formData = new FormData();
      formData.append('file', file) 
      try {
        const response = await fetch(`http://127.0.0.1:8000/hashrates/import/${currentEditCompanyId}`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${getCookie('accessToken')}`,
          },
        })
        if (response.status === 200) return response.data;
        throw new Error(`Response status code: ${response.status}`);
      } catch (error) {
        if (error.response.status === 403) throw new Error("Error during upload file");
        throw new Error(error.message);
      }
    },
  };