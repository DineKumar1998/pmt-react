import api from '../axios'

export const getRMClientList = async (params: any) => {
    const response = await api.get('/rm-portal/client/list', {
        params
    })
    return response.data
}

export const getRecentActivityClients = async (params: any) => {

    const response = await api.get('/rm-portal/client/recent/activity', {
        params
    })
    return response.data
}

export const getRecentlyAssignedClients = async (params: any) => {
    const response = await api.get('/rm-portal/client/recent/assign', {
        params
    })
    return response.data
}

export const getClientParameterList = async (id: string | number, params: any) => {
    console.log("id123=", id)
    console.log("params123=", params)
    const response = await api.get(`/rm-portal/client/parameters/${id}`, {
        params
    })
    console.log("getClientParameterList=", response.data)
    return response.data
}

export const getRMClientProjects = async (id: number, params: any) => {
    const response = await api.get(`/rm-portal/client/projects/${id}`, {
        params
    })
    return response.data
}

