import api from './axios'

export const getIndustryList = async (params: any) => {
    const response = await api.get('/industry/list', {
        params,
    })
    return response.data
}