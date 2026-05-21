import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const getStats = () => client.get('/stats').then(r => r.data);
export const getTopJobs = (n = 10) => client.get(`/top-jobs?n=${n}`).then(r => r.data);
export const getSalaryByExperience = () => client.get('/salary-by-experience').then(r => r.data);
export const getTopCountries = (min = 10) => client.get(`/top-countries?min_records=${min}`).then(r => r.data);
export const getFilteredData = (params) => client.get('/filter', { params }).then(r => r.data);
export const getUniqueValues = (col) => client.get(`/unique-values/${col}`).then(r => r.data);
export const predictSalary = (data) => client.post('/predict', data).then(r => r.data);
export const compareData = (data) => client.post('/compare', data).then(r => r.data);
export const getModelInfo = () => client.get('/model-info').then(r => r.data);
export const exportCsv = (params) => client.get('/export/csv', { params, responseType: 'blob' }).then(r => r.data);
export const exportPdf = (params) => client.get('/export/pdf', { params, responseType: 'blob' }).then(r => r.data);

export default client;
