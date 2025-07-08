import api from '../axios'

export const getRMDashboardStats = async (params: any) => {
    const response = await api.get('/rm-portal/dashboard', {
        params
    })
    return response.data
}