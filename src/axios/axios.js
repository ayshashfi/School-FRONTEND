import axios from 'axios'

const apiInstance = axios.create({
    // baseURL: 'http://127.0.0.1:8000/api/',
    baseURL: 'https://kidsschool.life/api/',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
});

export default apiInstance