import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInstance,
  CancelTokenSource,
  InternalAxiosRequestConfig
} from 'axios'

// 自定义配置选项接口
interface CustomOptions {
  retry?: number
  retryDelay?: number
  loadingCallback?: {
    onStart?: () => void
    onEnd?: () => void
  }
  cancelDuplicate?: boolean
  cancelDuplicateDelay?: number
}

type Result<T = any> = {
  code: number
  message: string
  data: T
}

// HttpService类
class HttpService {
  static defaultAxiosOptions: AxiosRequestConfig = {
    baseURL: '',
    timeout: 1000 * 60
  }

  static defaultCustomOptions: CustomOptions = {
    retry: 0,
    retryDelay: 3000,
    loadingCallback: {
      onStart: () => {},
      onEnd: () => {}
    },
    cancelDuplicate: false,
    cancelDuplicateDelay: 1000
  }

  private axiosOptions: AxiosRequestConfig
  private customOptions: CustomOptions
  private axiosInstance: AxiosInstance
  private pendingRequests: Map<string, CancelTokenSource>

  constructor(
    axiosOptions: AxiosRequestConfig = {},
    customOptions: CustomOptions = {}
  ) {
    this.axiosOptions = { ...HttpService.defaultAxiosOptions, ...axiosOptions }
    this.customOptions = {
      ...HttpService.defaultCustomOptions,
      ...customOptions
    }
    this.axiosInstance = axios.create(this.axiosOptions)
    this.pendingRequests = new Map()
    this._initInterceptors()
  }

  private _initInterceptors() {
    this.axiosInstance.interceptors.request.use(
      config => {
        return config
      },
      error => Promise.reject(error)
    )

    this.axiosInstance.interceptors.response.use(
      response => {
        return response
      },
      error => Promise.reject(error)
    )
  }

  setRequestInterceptor(
    onFulfilled: (
      value: InternalAxiosRequestConfig
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
    onRejected: (error: any) => any
  ) {
    this.axiosInstance.interceptors.request.use(onFulfilled, onRejected)
  }

  setResponseInterceptor(
    onFulfilled: (
      value: AxiosResponse
    ) => AxiosResponse | Promise<AxiosResponse>,
    onRejected: (error: any) => any
  ) {
    this.axiosInstance.interceptors.response.use(onFulfilled, onRejected)
  }

  async request<T>(
    config: AxiosRequestConfig,
    customOptions: CustomOptions = {}
  ): Promise<AxiosResponse<Result<T>>> {
    const finalCustomOptions = { ...this.customOptions, ...customOptions }
    const {
      retry,
      retryDelay,
      loadingCallback,
      cancelDuplicate,
      cancelDuplicateDelay
    } = finalCustomOptions

    const requestKey = `${config.method}:${config.url}`
    if (cancelDuplicate && this.pendingRequests.has(requestKey)) {
      const cancelTokenSource = this.pendingRequests.get(requestKey)
      cancelTokenSource?.cancel('Duplicate request canceled')
      this.pendingRequests.delete(requestKey)
      await this.delay(cancelDuplicateDelay as number)
    }

    const cancelTokenSource = axios.CancelToken.source()
    this.pendingRequests.set(requestKey, cancelTokenSource)

    let retries = 0
    const executeRequest = async (): Promise<AxiosResponse> => {
      loadingCallback?.onStart?.()
      try {
        const response = await this.axiosInstance({
          ...config,
          cancelToken: cancelTokenSource.token
        })
        this.pendingRequests.delete(requestKey)
        loadingCallback?.onEnd?.()
        return response
      } catch (error) {
        if (axios.isCancel(error)) {
          throw error
        } else if (retry && retries < retry) {
          retries++
          await this.delay(retryDelay as number)
          return executeRequest()
        } else {
          this.pendingRequests.delete(requestKey)
          loadingCallback?.onEnd?.()
          throw error
        }
      }
    }

    return executeRequest()
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  get<T>(
    url: string,
    config: AxiosRequestConfig = {},
    customOptions: CustomOptions = {}
  ): Promise<AxiosResponse<Result<T>>> {
    return this.request<T>({ url, method: 'GET', ...config }, customOptions)
  }

  post(
    url: string,
    data: any,
    config: AxiosRequestConfig = {},
    customOptions: CustomOptions = {}
  ): Promise<AxiosResponse> {
    return this.request({ url, method: 'POST', data, ...config }, customOptions)
  }

  put(
    url: string,
    data: any,
    config: AxiosRequestConfig = {},
    customOptions: CustomOptions = {}
  ): Promise<AxiosResponse> {
    return this.request({ url, method: 'PUT', data, ...config }, customOptions)
  }

  delete(
    url: string,
    config: AxiosRequestConfig = {},
    customOptions: CustomOptions = {}
  ): Promise<AxiosResponse> {
    return this.request({ url, method: 'DELETE', ...config }, customOptions)
  }

  async downloadFile(
    url: string,
    config: AxiosRequestConfig = {},
    customOptions: CustomOptions = {}
  ): Promise<void> {
    const response = await this.get(
      url,
      { responseType: 'blob', ...config },
      customOptions
    )

    let fileName = 'downloaded_file'
    const contentDisposition = response.headers['content-disposition']
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/)
      if (fileNameMatch && fileNameMatch.length === 2) {
        fileName = fileNameMatch[1]
      }
    }

    const urlBlob = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = urlBlob
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  async downloadFileGet(
    url: string,
    config: AxiosRequestConfig = {},
    customOptions: CustomOptions = {}
  ): Promise<void> {
    return this.downloadFile(url, config, customOptions)
  }
}

export default HttpService
