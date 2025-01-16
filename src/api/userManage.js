import http from '@/utils/primaryHttp'
export const useUserManageApi = {
  getUserList: (params) => {
    return  http.post('/userManage/getUserList', params)
  },
  addUser: (params) => {
    return  http.post('/userManage/addUser', params)
  },
  editUser: (params) => {
    return  http.post('/userManage/editUser', params)
  },
  deleteUser: (params) => {
    return  http.post('/userManage/deleteUser', params)
  },
   
}