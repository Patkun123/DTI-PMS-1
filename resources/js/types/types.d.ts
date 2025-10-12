type PurchaseRequestChartPoint = {
  date: string
  total: number
}

type DashboardStats = {
  daily: number
  weekly: number
  monthly: number
  complete: number
  ongoing: number
  cancelled: number
  chartData: PurchaseRequestChartPoint[]
}
