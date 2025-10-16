import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavSab } from '@/components/nav-sab';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, userdashboard, usermanagementindex, } from '@/routes';
import { index as purchaseRequestsIndex } from '@/routes/purchase-requests';
import { index as ppmpIndex } from '@/routes/ppmp';
import { type NavItem, type PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
  BookOpen,
  LayoutGrid,
  ShoppingCart,
  Users,
  BookmarkCheck,
  ScrollText,
  FileText,
  BarChart3,
  Settings,
  ChevronRight,
  FileChartColumn
} from "lucide-react";
import AppLogo from './app-logo';


export function AppSidebar() {
    const { props } = usePage<PageProps>();
    const userRole = props.auth?.user?.role;

    // Base menu items (for all roles)
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: userdashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Purchase Requests',
            href: purchaseRequestsIndex(),
            icon: ShoppingCart,
        },
    ];

    // Role-specific routes (Admin)
    if (userRole === 'admin') {
        mainNavItems.length = 0; // clear duplicates
        mainNavItems.push(
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
            {
                title: 'Purchase Requests',
                href: purchaseRequestsIndex(),
                icon: ShoppingCart,
            },
            {
                title: 'User Management',
                href: '/admin/users',
                icon: Users,
            },
            {
                title: 'PPMP Management',
                href: ppmpIndex(),
                icon: BookmarkCheck,
            },
        );
    }

    const reportItems : NavItem[] = [
        {
            title: "PR Reports",
            href: usermanagementindex(),
            icon: FileText,
        },
        {
            title: "PMR Reports",
            href: "/reports/ppmp",
            icon: FileChartColumn,
        },
        {
            title: "Analytics",
            href: "/reports/ppmp",
            icon: BarChart3,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'About System',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: BookOpen,
        },
        // {
        //     title: 'Documentation',
        //     href: 'https://laravel.com/docs/starter-kits#react',
        //     icon: BookOpen,
        // },
    ];
        if (userRole === 'admin')
            {
            footerNavItems.unshift({
            title: 'System Settings',
            href: 'https://laravel.com/docs',
            icon: Settings,
        });
    }
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch className='bg-background'>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavSab items={reportItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
