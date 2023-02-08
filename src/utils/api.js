import axios from "../axiosConfig";
import { getCookie } from "./cookie";


export const api = {
    fetchData: async ( parameters ,url) => {
      try {
        const response = await axios.get(url,
          {  headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('accessToken')}`
        }, },
        );
        if (response.status === 200 && response.data) return response.data;
        throw new Error(`Response status code: ${response.status}`);
      } catch (error) {
        throw new Error(error.message);
      }
    },
  };