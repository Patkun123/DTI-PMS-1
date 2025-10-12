import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

// ─────────────────────────────
// 🧩 User and Auth definitions
// ─────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  email_verified_at?: string | null;
  two_factor_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown; // allows extra dynamic fields
}

export interface Auth {
  user?: User;
}

// ─────────────────────────────
// 🧭 Navigation types
// ─────────────────────────────
export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: NonNullable<InertiaLinkProps["href"]>;
  icon?: LucideIcon | null;
  isActive?: boolean;
  items?: NavItem[]; // ✅ add this line to support dropdown/submenu
}

// ─────────────────────────────
// 📦 Shared props passed from backend
// ─────────────────────────────
export interface SharedData {
  name?: string;
  quote?: { message: string; author: string };
  auth?: Auth;
  sidebarOpen?: boolean;
  [key: string]: unknown;
}

// ─────────────────────────────
// 🌐 PageProps for Inertia (global)
// ─────────────────────────────
export interface PageProps extends InertiaPageProps {
  auth?: {
    user?: User;
  };
  [key: string]: any; // ✅ fixes the TS constraint error
}
