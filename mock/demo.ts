/*
 * @Author: tuyongtao1
 * @Date: 2023-03-22 10:56:34
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2023-05-26 10:30:07
 * @Description:
 */
import { MockMethod } from 'vite-plugin-mock'
import Mock, { Random } from 'mockjs'

export default [
  {
    url: '/api/demo',
    method: 'post',
    response: () => {
      console.log(Random.cfirst())
      const { list: data } = Mock.mock({
        'list|4': [
          {
            name: '@cname',
            phone: /^1[0-9]{10}$/
          }
        ]
      })
      return {
        code: 200,
        message: 'ok',
        data
      }
    }
  }
] as MockMethod[]
