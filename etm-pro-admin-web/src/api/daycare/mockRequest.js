import Axios from 'axios'

const request = Axios.create({
  baseURL: 'http://192.168.7.54:3000/mock/132/',
  timeout: 300000

})

request.interceptors.request.use(request => {
  return request
})

request.interceptors.response.use(response => {
  return response.data
})

export default request
