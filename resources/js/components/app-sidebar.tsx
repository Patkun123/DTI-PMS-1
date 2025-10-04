import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
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
import { dashboard, userdashboard } from '@/routes';
import { index as purchaseRequestsIndex } from '@/routes/purchase-requests';
import { type NavItem, type PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, ShoppingCart } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    // ✅ Type-safe Inertia props
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
            }
        );
    }

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
