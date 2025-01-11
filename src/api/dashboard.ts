import http from '@/utils/primaryHttp'
export const useDashboardApi = {
  getDashboardCardList: () =>
    http.post<DashboardCardItem[]>('/dashboard/dashboardCardList', {
      key: 'test'
    })
}

interface DashboardCardItem {
  icon: string
  title: string
  value: number
  total: number
  color: string
  action: string
}
