import axios from 'axios'
import { ElLoading } from 'element-plus'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { urlLoadingList } from './urlLoadingList'
type Result<T = any> = {
  code: number
  message: string
  data: T
}
interface selfOptions {
  urlLoadingList: string[]
}

// 接口代理 path
const PROXY_URL = '/api'

// 不需要拦截响应错误的url白名单
const urlWhiteList: string[] = ['/verifyTicket', '/login', '/logout']
// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
  instance: AxiosInstance
  baseConfig: AxiosRequestConfig = {
    baseURL: PROXY_URL,
    withCredentials: true, // 跨域时需要带上cookie需要开启
    // TODO
    timeout: 60000
  }

  constructor(config: AxiosRequestConfig, options: selfOptions) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config))
    // 使用loading
    let loadingInstance: any
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (options.urlLoadingList.includes(config.url || '')) {
          loadingInstance = ElLoading.service({
            text: 'loading...'
          })
        }
        // 白名单内不校验拦截器
        if (urlWhiteList.some(item => config.url!.indexOf(item) > -1)) {
          return config
        }
        // 一般会请求拦截里面加token，用于后端的验证
        const token = localStorage.getItem('token') as string
        if (token && config?.headers) {
          config.headers!.Authorization = token
        }

        return config
      },
      (err: AxiosError) => {
        // 关闭loading
        if (options.urlLoadingList.includes(err.config?.url || '')) {
          loadingInstance.close()
        }
        // 请求错误，这里可以用全局提示框进行提示
        return Promise.reject(err)
      }
    )

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        // 关闭loading
        if (options.urlLoadingList.includes(res.config?.url || '')) {
          loadingInstance.close()
        }
        // 直接返回res，当然你也可以只返回res.data
        // 系统如果有自定义code也可以在这里处理
        if (res.data.code == 200) {
          return res.data
        } else {
          ElMessage.error(res.data.message)
          return Promise.reject(res.data)
        }
      },
      (err: AxiosError) => {
        // 关闭loading
        if (options.urlLoadingList.includes(err.config?.url || '')) {
          loadingInstance.close()
        }
        // 这里用来处理http常见错误，进行全局提示
        let messageText = ''
        switch (err.response?.status) {
          case 400:
            messageText = '请求错误(400)'
            break
          case 401:
            messageText = '未授权，请重新登录(401)'
            // 这里可以做清空storage并跳转到登录页的操作
            break
          case 403:
            messageText = '拒绝访问(403)'
            break
          case 404:
            messageText = '请求出错(404)'
            break
          case 408:
            messageText = '请求超时(408)'
            break
          case 500:
            messageText = '服务器错误(500)'
            break
          case 501:
            messageText = '服务未实现(501)'
            break
          case 502:
            messageText = '网络错误(502)'
            break
          case 503:
            messageText = '服务不可用(503)'
            break
          case 504:
            messageText = '网络超时(504)'
            break
          case 505:
            messageText = 'HTTP版本不受支持(505)'
            break
          default:
            messageText = `连接出错，请检查是否登录！`
        }
        ElMessage.error(messageText)

        return Promise.reject(err.response)
      }
    )
  }

  // 定义请求方法
  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config)
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.get(url, config)
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.post(url, data, config)
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.put(url, data, config)
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.delete(url, config)
  }
}

export default new Request({}, { urlLoadingList })
