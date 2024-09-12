import axios from "axios";
import { API_BASE_URL, ATTENDANCE, CHAT, RESULT,LEAVE } from "../constants/urls";
import { refreshauthToken } from "./apiServers";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { updateAuthToken } from "../redux/AuthSlice";


export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    async function (config) {
        const tokens = JSON.parse(localStorage.getItem('authTokens'));
        const accessToken = tokens.access;
        const refreshToken = tokens.refresh;
        // const dispatch = useDispatch()
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            const user = jwtDecode(accessToken)
            const isExp = dayjs.unix(user.exp).diff(dayjs()) < 1
            if(isExp){
                console.log('I was called');
                const res = await refreshauthToken()
                console.log(res, 'res');
                
                if (res.status === 200 || res.status === 201){
                    config.headers.Authorization = `Bearer ${res.data.access}`
                    localStorage.setItem('authTokens', JSON.stringify(res.data));
                    // dispatch(updateAuthToken())
                }else{
                    console.log(res)
                }
            }
        } 
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export const axiosFormInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    }
});

axiosFormInstance.interceptors.request.use(
    async function (config) {
        const tokens = JSON.parse(localStorage.getItem('authTokens'));
        const accessToken = tokens.access;
        const refreshToken = tokens.refresh;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            const user = jwtDecode(accessToken)
            const isExp = dayjs.unix(user.exp).diff(dayjs()) < 1
            if(isExp) {
                const res = await axios.post(`${API_BASE_URL}token/refresh/`, { refresh: refreshToken})
                if (res.status === 200 || res.status === 201) {
                    config.headers.Authorization = `Bearer ${res.data.access}`
                    localStorage.setItem('authTokens', JSON.stringify(res.data));
                } else {
                    console.log(res)
                }
            }
        }
        return config;
    },
    function (error) {
        return Promise.reject(error)
    }
);


export const axiosAttendanceInstance = axios.create({
    baseURL: ATTENDANCE,
    headers: {
        'Content-Type': 'application/json'
    }
});


axiosAttendanceInstance.interceptors.request.use(
    async function (config) {
        const tokens = JSON.parse(localStorage.getItem('authTokens'));
        const accessToken = tokens.access;
        const refreshToken = tokens.refresh;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            const user = jwtDecode(accessToken)
            const isExp = dayjs.unix(user.exp).diff(dayjs()) < 1
            if(isExp) {
                const res = await axios.post(`${API_BASE_URL}token/refresh/`, { refresh: refreshToken})
                if (res.status === 200 || res.status === 201) {
                    config.headers.Authorization = `Bearer ${res.data.access}`
                    localStorage.setItem('authTokens', JSON.stringify(res.data));
                } else {
                    console.log(res)
                }
            }
        }
        return config;
    },
    function (error) {
        return Promise.reject(error)
    }
);

export const axiosResultInstance = axios.create({
    baseURL: RESULT,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosResultInstance.interceptors.request.use(
    async function (config) {
        const tokens = JSON.parse(localStorage.getItem('authTokens'));
        const accessToken = tokens.access;
        const refreshToken = tokens.refresh;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            const user = jwtDecode(accessToken)
            const isExp = dayjs.unix(user.exp).diff(dayjs()) < 1
            if(isExp) {
                const res = await axios.post(`${API_BASE_URL}token/refresh/`, { refresh: refreshToken})
                if (res.status === 200 || res.status === 201) {
                    config.headers.Authorization = `Bearer ${res.data.access}`
                    localStorage.setItem('authTokens', JSON.stringify(res.data));
                } else {
                    console.log(res)
                }
            }
        }
        return config;
    },
    function (error) {
        return Promise.reject(error)
    }
);


export const axiosChatInstance = axios.create({
    baseURL:CHAT,
    headers:{
        'content-Type' : 'application/json'
    }

});

axiosChatInstance.interceptors.request.use(
    async function (config) {
        const tokens = JSON.parse(localStorage.getItem('authTokens'));
        const accessToken = tokens.access;
        const refreshToken = tokens.refresh;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            const user = jwtDecode(accessToken);
            const isExp = dayjs.unix(user.exp).diff(dayjs()) < 1;
            if (isExp) {
                const res = await axios.post(`${API_BASE_URL}token/refresh/`, { refresh: refreshToken });
                if (res.status === 200 || res.status === 201) {
                    config.headers.Authorization = `Bearer ${res.data.access}`;
                    localStorage.setItem('authTokens', JSON.stringify(res.data));
                } else {
                    console.log(res);
                }
            }
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);


export const axiosLeaveInstance = axios.create({
    baseURL: LEAVE,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosLeaveInstance.interceptors.request.use(
    async function (config) {
        const tokens = JSON.parse(localStorage.getItem('authTokens'));
        const accessToken = tokens?.access;
        const refreshToken = tokens?.refresh;

        if (accessToken) {
            const user = jwtDecode(accessToken);
            const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

            if (isExpired) {
                try {
                    const res = await axios.post(`${API_BASE_URL}token/refresh/`, { refresh: refreshToken });
                    if (res.status === 200 || res.status === 201) {
                        localStorage.setItem('authTokens', JSON.stringify(res.data));
                        config.headers.Authorization = `Bearer ${res.data.access}`;
                    } else {
                        console.log('Refresh token response:', res);
                    }
                } catch (error) {
                    console.error('Token refresh error:', error);
                }
            } else {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }

        console.log('Request headers:', config.headers); // Debugging line

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default axiosLeaveInstance;