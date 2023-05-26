import request from '@/utils/request'
import { IUserInfo } from './dto/index'
export const useDemoApi = {
  demo: (params: IUserInfo) => request.get<Array<IUserInfo>>('/demo', params)
}
