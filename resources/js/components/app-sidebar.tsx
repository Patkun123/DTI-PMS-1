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
import { dashboard, userdashboard, usermanagementindex, } from '@/routes';
import { index as purchaseRequestsIndex } from '@/routes/purchase-requests';
import { type NavItem, type PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, ShoppingCart, BookmarkCheck, Users, Settings, ScrollText } from 'lucide-react';
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
        {
            title: 'Reports',
            href: purchaseRequestsIndex(),
            icon: ScrollText,
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
                title: 'User',
                href: usermanagementindex(),
                icon: Users,
            }
        );
    }
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
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
