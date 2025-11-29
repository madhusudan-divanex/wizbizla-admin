import axios from "axios";

const API_BASE_URL = 'https://act.divanex.in/api'
export const imgUrl =  'https://act.divanex.in/api'

const apiActInfo = axios.create({
    baseURL: API_BASE_URL
});

apiActInfo.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = "multipart/form-data"
        } else {
            config.headers["Content-Type"] = "application/json"
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export const getData = async (endpoint) => {
    try {
        const response = await apiActInfo.get(endpoint);
        return response.data;
    } catch (error) {
        console.error("GET Error:", error);
        throw error;
    }
}

export const postData = async (endpoint, data) => {
    try {
        const response = await apiActInfo.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error("POST Error:", error);
        throw error;
    }
}

export const putData = async (endpoint, data) => {
    try {
        const response = await apiActInfo.put(endpoint, data);
        return response.data;
    } catch (error) {
        console.error("PUT Error:", error);
        throw error;
    }
}

export const patchData = async (endpoint, data) => {
    try {
        const response = await apiActInfo.patch(endpoint, data);
        return response.data;
    } catch (error) {
        console.error("PATCh Error:", error);
        throw error;
    }
}

export const deleteData = async (endpoint) => {
    try {
        const response = await apiActInfo.delete(endpoint);
        return response.data;
    } catch (error) {
        console.error("DELETE Error:", error);
        throw error;
    }
};