import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { StaticCards } from "@/components/dashboard/static-card";
import { ChartAreaInteractive } from "@/components/dashboard/charts";
import { usePage } from '@inertiajs/react'



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];
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

interface DashboardPageProps {
  stats: DashboardStats
  [key: string]: unknown
}


export default function Dashboard() {
    const { stats } = usePage<DashboardPageProps>().props

  const chartData = stats.chartData || []

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <StaticCards stats={stats} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={chartData} />
              </div>
            </div>
          </div>
        </div>
        </AppLayout>
    );
}
