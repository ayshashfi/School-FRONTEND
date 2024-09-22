import axios from 'axios'

const apiInstance = axios.create({
    baseURL: 'https//kidsschool.life/api/',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
});

export default apiInstance