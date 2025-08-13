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
export const getParameterWeightages = async (industryId: number,scale:string) => {
    const response = await api.get(`/parameter/weightages?industryId=${industryId}&scale=${scale}`, {
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
    return response.data
}

export const editParameter = async (id: string | number, data: any) => {
    const response = await api.patch(`/parameter/edit/${id}`, data)
    return response.data
}

export const editParameterWeightages = async (data: any) => {
    const response = await api.patch(`/parameter/edit-weightages`, data)
    return response.data
}

export const exportParameterList = async (params: any) => {
    const response = await api.get('/parameter/export', {
        params,
        responseType: 'blob',
    })
    return response.data
}

export const getClientParameterList = async (id: string | number, params: any) => {
    const response = await api.get(`/rm-portal/client/parameters/${id}`, {
        params
    })
    return response.data
}
export const getClientSelectedParameters = async (id: string | number, params?: any) => {
    const response = await api.get(`/rm-portal/client/parameters/${id}/selected`, {
        params
    })
    return response.data
}

export const selectParameterOption = async (data: any) => {
    const response = await api.patch(`/rm-portal/client/edit/parameter`, data)
    return response.data
}
