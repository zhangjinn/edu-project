import axios from 'axios'

const url = 'http://192.168.7.54:3000/mock/132'

const request = axios.create({
  baseURL: url,
  timeout: 300000
})

request.interceptors.request.use(request => {
  return request
})

request.interceptors.response.use(response => {
  const data = { data: response.data }
  return data
})

export default request
