import api from './axios'

export const createParameter = async (data: any) => {
    const response = await api.post('/parameter/create', data)
    return response.data
}

export const mapParameterToIndustries = async (id: string | number, data: any) => {
    const response = await api.post(`/parameter/${id}/industries`, data)
    return response.data
}

export const getParameterList = async (params: any) => {
    const response = await api.get('/parameter/list', {
        params
    })
    return response.data
}

export const getParameterQuestions = async (params: any) => {
    const response = await api.get('/parameter/questions', {
        params
    })
    return response.data
}

export const getParameterById = async (id: string | number, language: string) => {
    const response = await api.get(`/parameter/${id}`, {
        params: { language },
    })
    return response.data
}

export const deleteParameterIndustryMapping = async (paramId: string | number, industryId: string | number) => {
    const response = await api.delete(`/parameter/${paramId}/industry/${industryId}`)
    console.log("deleteParameterIndustryMapping response=", response.data)
    return response.data
}

export const editParameter = async (id: string | number, data: any) => {
    const response = await api.patch(`/parameter/edit/${id}`, data)
    console.log("editParameter response=", response.data)
    return response.data
}
