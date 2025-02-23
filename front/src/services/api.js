import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = {
  // 기업 관련 API
  companies: {
    getAll: () => axios.get(`${API_URL}/companies`),
    create: (data) => axios.post(`${API_URL}/companies`, data),
    update: (id, data) => axios.put(`${API_URL}/companies/${id}`, data),
  },

  // 회원 관련 API
  members: {
    getByCompany: (companyId) => axios.get(`${API_URL}/members/company/${companyId}`),
    create: (data) => axios.post(`${API_URL}/members`, data),
  },

  // 출석 관련 API
  attendance: {
    getByCompany: (companyId) => axios.get(`${API_URL}/attendance/company/${companyId}`),
    create: (data) => axios.post(`${API_URL}/attendance`, data),
  },
};

export default api; 