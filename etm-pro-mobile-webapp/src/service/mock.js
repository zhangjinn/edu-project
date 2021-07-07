import axios from 'axios'

const URL = 'http://192.168.7.54:3000/mock/125'

const service = axios.create({
  baseURL: URL,
  timeout: 5000 // request timeout
})

export default service
