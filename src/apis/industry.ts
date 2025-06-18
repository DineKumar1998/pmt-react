import api from './axios'

export const getIndustryList = async (language: string) => {
    const response = await api.get('/industry/list', {
        params: { language },
    })
    console.log("getIndustryList response=", response.data)
    return response.data
}