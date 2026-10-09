import axios from 'axios'

export const getDataAPI = async (url, token) => {
    const res = await axios.get(`/api/${url}`, {
        headers: { Authorization: token }
    })
    return res;
}

export const postDataAPI = async (url, data, token = "") => {
    const method = "POST"
    const baseUrl = `/api/${url}`;
    const headers = { "Content-Type": "application/json", "Authorization": token }

    const options = {
        method,
        headers,
        credentials: 'include'
    }

    if (data && typeof data === 'object') {
        options.body = JSON.stringify({ ...data })
    }

    const response = await fetch(baseUrl, options);
    const datas = await response.json();
    return datas;
}

export const putDataAPI = async (url, post, token) => {
    const res = await axios.put(`/api/${url}`, post, {
        headers: { Authorization: token }
    })
    return res;
}

export const patchDataAPI = async (url, post, token) => {
    const res = await axios.patch(`/api/${url}`, post, {
        headers: { Authorization: token }
    })
    return res;
}

export const deleteDataAPI = async (url, token) => {
    const res = await axios.delete(`/api/${url}`, {
        headers: { Authorization: token }
    })
    return res;
}