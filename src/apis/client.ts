import api from './axios'

export const getClientList = async (params: any) => {
    const response = await api.get('/client/list', {
        params
    })
    return response.data
}

export const getRecentlyAddedClients = async (params: any) => {
    const response = await api.get('/client/list/recently/added', {
        params
    })
    return response.data
}

export const getClientById = async (id: string | number, language: string) => {
    const response = await api.get(`/client/${id}`, {
        params: { language },
    })
    return response.data
}

export const assignRmToClient = async (id: string | number, data: any) => {
    const response = await api.patch(`/client/assign-rm/${id}`, data)
    return response.data
}

export const getRMClientProjects = async (id: number, params: any) => {
    const response = await api.get(`/rm-portal/client/projects/${id}`, {
        params
    })
    return response.data
}