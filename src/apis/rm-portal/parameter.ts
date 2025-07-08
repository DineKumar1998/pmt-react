import api from '../axios'

export const selectParameterOption = async (data: any) => {
    const response = await api.patch(`/rm-portal/client/edit/parameter`, data)
    return response.data
}