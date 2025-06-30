import api from './axios'

export const getDashboardStats = async (params: any) => {
    const response = await api.get('/dashboard', {
        params
    })
    return response.data
}