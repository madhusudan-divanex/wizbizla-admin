
import axios from "axios";
import base_url from "../baseUrl";



export const getApiData = async (endpoint) => {
  const res = await axios.get(`${base_url}/${endpoint}`)
  return res.data
}
export const getSecureApiData = async (endpoint) => {

  try {
    const res = await axios.get(`${base_url}/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });
    return res.data;
  } catch (error) {
    // Let the caller handle the error
    throw error;
  }
}



export const postApiData = async (endpoint, data) => {
  const res = await axios.post(`${base_url}/${endpoint}`, data, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`
    }
  })
  return res.data
}
export const updateApiData = async (endpoint, data) => {
  const res = await axios.put(`${base_url}/${endpoint}`, data, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`
    }
  })
  return res.data
}
export const deleteApiData = async (endpoint) => {
  const res = await axios.delete(`${base_url}/${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`
    }
  })
  return res.data
}
