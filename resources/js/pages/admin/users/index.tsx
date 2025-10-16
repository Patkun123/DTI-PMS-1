import { Head, Link, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { ToastContainer, toast } from 'react-toastify'
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type BreadcrumbItem } from "@/types"
import { UsersTable } from "@/components/users/table"
import { router } from '@inertiajs/react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "User Management",
    href: "/admin/users",
  },
]

interface User {
  id: number
  name: string
  email: string
  role: string
  division: string | null
  requester: string | null
  created_at: string
}

interface UsersPageProps {
  users: {
    data: User[]
    current_page: number
    last_page: number
    total: number
    per_page: number
  }
}

export default function UsersIndex({ users }: UsersPageProps) {
  const { props }: any = usePage()
  
  if (props.flash?.success) {
    toast.success(props.flash.success)
  }
  if (props.flash?.error) {
    toast.error(props.flash.error)
  }

  const handleDelete = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      router.delete(`/admin/users/${userId}`, {
        onSuccess: () => toast.success('User deleted successfully'),
        onError: () => toast.error('Failed to delete user'),
      })
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User Management" />
      <ToastContainer />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage and track all users</p>
          </div>
          <Link href="/admin/users/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </Link>
        </div>
        
        {/* User Statistics Cards */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="relative rounded-xl border border-border p-4">
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl font-bold">{users.total}</p>
          </div>
          <div className="relative rounded-xl border border-border p-4">
            <h3 className="text-lg font-semibold">Admin Users</h3>
            <p className="text-2xl font-bold">
              {users.data.filter((user) => user.role === 'admin').length}
            </p>
          </div>
          <div className="relative rounded-xl border border-border p-4">
            <h3 className="text-lg font-semibold">Regular Users</h3>
            <p className="text-2xl font-bold">
              {users.data.filter((user) => user.role === 'user').length}
            </p>
          </div>
        </div>

        <UsersTable 
          data={users.data} 
          pagination={users}
          onDelete={handleDelete}
        />
      </div>
    </AppLayout>
  )
}
