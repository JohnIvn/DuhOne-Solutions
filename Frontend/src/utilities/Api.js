import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// const verifyRecaptcha = async (recaptchaResponse) => {
//     const secretKey = ''; 
//     const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;
  
//     const { data } = await axios.post(url);
//     return data.success;
//   };

export default api;