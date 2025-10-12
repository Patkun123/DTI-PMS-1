import * as React from "react";
import { Link, usePage } from "@inertiajs/react";
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
} from "lucide-react";

import { NavFooter } from "@/components/nav-footer";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import AppLogo from "./app-logo";
import { dashboard, userdashboard, usermanagementindex } from "@/routes";
import { index as purchaseRequestsIndex } from "@/routes/purchase-requests";
import { type PageProps } from "@/types";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { props: pageProps } = usePage<PageProps>();
  const userRole = pageProps.auth?.user?.role;

  // Base menu
  const mainNavItems = [
    {
      title: "Dashboard",
      href: userRole === "admin" ? dashboard() : userdashboard(),
      icon: LayoutGrid,
    },
    {
      title: "Purchase Requests",
      href: purchaseRequestsIndex(),
      icon: ShoppingCart,
    },
  ];

  // Admin-only additions
  if (userRole === "admin") {
    mainNavItems.push(
      {
        title: "User Management",
        href: usermanagementindex(),
        icon: Users,
      },
      {
        title: "PPMP Management",
        href: usermanagementindex(),
        icon: BookmarkCheck,
      }
    );
  }

  const reportItems = [
    {
      title: "PR Reports",
      href: usermanagementindex(),
      icon: FileText,
    },
    {
      title: "PMR Reports",
      href: "/reports/ppmp",
      icon: BarChart3,
    },
  ];

  const footerNavItems = [
    ...(userRole === "admin"
      ? [
          {
            title: "System Settings",
            href: "https://laravel.com/docs",
            icon: Settings,
          },
        ]
      : []),
    {
      title: "About System",
      href: "https://github.com/laravel/react-starter-kit",
      icon: BookOpen,
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={dashboard()} prefetch className="bg-background">
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {/* Normal menu items */}
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {/* Collapsible Reports Section */}
        {userRole === "admin" && (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
            <CollapsibleTrigger asChild>
                <SidebarMenuButton className="w-full justify-between">
                <div className="flex items-center gap-2">
                    <ScrollText className="h-4 w-4" />
                    <span>Reports</span>
                </div>
                <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
                 <SidebarMenu>
                    {reportItems.map((subItem) => (
                    <SidebarMenuItem key={subItem.title} className="ml-6 mt-1 space-y-1">
                        <SidebarMenuButton asChild>
                        <Link href={subItem.href} className="flex items-center gap-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                            <subItem.icon className="mr-2 h-4 w-4" />
                            {subItem.title}
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
        )}

      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
