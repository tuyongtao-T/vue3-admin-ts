import http from '@/utils/primaryHttp'
export const useDashboardApi = {
  getDashboardCardList: () =>
    http.get<DashboardCardItem[]>('/dashboardCardList')
}

interface DashboardCardItem {
  icon: string
  title: string
  value: number
  total: number
  color: string
  action: string
}
