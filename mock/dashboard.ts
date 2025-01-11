import { MockMethod } from 'vite-plugin-mock'
import Mock, { Random } from 'mockjs'

export default [
  {
    url: '/api/dashboard/dashboardCardList',
    method: 'post',
    response: () => {
      // const { list: data2 } = Mock.mock({
      //   'list|4': [
      //     {
      //       name: '@cname',
      //       phone: /^1[0-9]{10}$/,
      //     }
      //   ]
      // })
      const data = [
        {
          title: '访问数',
          icon: 'PartlyCloudy',
          value: 2000,
          total: 120000,
          color: 'green',
          action: '月'
        },
        {
          title: '成交额',
          icon: 'Sunset',
          value: 20000,
          total: 500000,
          color: 'blue',
          action: '月'
        },
        {
          title: '下载数',
          icon: 'Drizzling',
          value: 8000,
          total: 120000,
          color: 'orange',
          action: '周'
        },
        {
          title: '成交数',
          icon: 'Lightning',
          value: 5000,
          total: 50000,
          color: 'purple',
          action: '年'
        }
      ]
      return {
        code: 200,
        message: 'ok',
        data: data
      }
    }
  }
] as MockMethod[]
