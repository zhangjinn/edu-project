import Axios from 'axios'
// import request from '@/utils/request'
const request = Axios.create({
  baseURL: 'http://192.168.7.87:3000/mock/18/',
  timeout: 3000

})

request.interceptors.request.use(request => {
  return request
})

request.interceptors.response.use(response => {
  return response.data
})

export default request
