import api from './axios'

export const getRMList = async (params: any) => {
    const response = await api.get('/rm/list', {
        params
    })
    return response.data
}

export const getRMById = async (id: string | number, language: string) => {
    const response = await api.get(`/rm/${id}`, {
        params: { language },
    })
    return response.data
}

export const createRM = async (data: any) => {
    const response = await api.post('/rm/create', data)
    return response.data
}

export const editRM = async (id: string | number, data: any) => {
    const response = await api.patch(`/rm/edit/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    console.log("editRM response=", response.data)
    return response.data
}

export const getRMByRecentActivity = async (params: any) => {
    const response = await api.get('/rm/list/recent/activity', {
        params
    })
    return response.data
}

export const getTop5RM = async (params: any) => {
    const response = await api.get('/rm/list/top', {
        params
    })
    return response.data
}

export const getRMNames = async (language: string) => {
    const response = await api.get('/rm/listing', {
        params: { language },
    })
    return response.data
}