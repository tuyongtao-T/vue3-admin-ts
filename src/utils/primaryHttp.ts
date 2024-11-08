import HttpService from './HttpService'

// 正常请求
const http = new HttpService({
  baseURL: '/api',
  withCredentials: true,
  timeout: 5000
})
http.setRequestInterceptor(
  config => {
    return config
  },
  error => Promise.reject(error)
)

http.setResponseInterceptor(
  response => {
    // 可以在这里处理响应数据
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

export default http
