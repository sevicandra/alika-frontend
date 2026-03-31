import { UserAccount } from "@/types/auth";

export interface RouteConfig {
  path: string;
  exact?: boolean;
  service?: string;
  roles?: string[];
  redirect?: string;
}

export const AppRoutes: RouteConfig[] = [
  // RBAC Protected Paths
  { path: "/sso", service: "ACCOUNT", roles: ["ADMIN"] },
  { path: "/mutasi/admin", service: "MUTASI", roles: ["ADMIN"] },
  { path: "/mutasi/keuangan", service: "MUTASI", roles: ["KEUANGAN"] },
  { path: "/mutasi/sdm", service: "MUTASI", roles: ["SDM"] },

  // Exact Redirects
  { path: "/penghasilan", exact: true, redirect: "/penghasilan/dashboard" },
  { path: "/mutasi", exact: true, redirect: "/mutasi/user/dashboard" },
  { path: "/mutasi/user", exact: true, redirect: "/mutasi/user/dashboard" },
  { path: "/mutasi/admin", exact: true, redirect: "/mutasi/admin/user" },
  { path: "/mutasi/keuangan", exact: true, redirect: "/mutasi/keuangan/sk" },
  { path: "/mutasi/sdm", exact: true, redirect: "/mutasi/sdm/sk" },
];

export function hasRole(
  accounts: UserAccount[],
  serviceName: string,
  roleName: string,
): boolean {
  return !!accounts
    .find((a) => a.service.toUpperCase() === serviceName.toUpperCase())
    ?.roles.find((r) => r.nama.toUpperCase() === roleName.toUpperCase());
}

export function checkRouteAccess(
  pathname: string,
  accounts: UserAccount[],
): { authorized: boolean; redirect?: string } {
  // 1. Check if user is authorized for the route prefix
  for (const route of AppRoutes.filter(
    (r) => !r.exact && r.service && r.roles,
  )) {
    if (pathname.startsWith(route.path)) {
      const isAuthorized = route.roles!.some((role) =>
        hasRole(accounts, route.service!, role),
      );
      if (!isAuthorized) {
        return { authorized: false, redirect: "/" };
      }
    }
  }

  // 2. Check if the path needs a direct redirect
  const exactRedirect = AppRoutes.find(
    (r) => r.exact && r.path === pathname && r.redirect,
  );
  if (exactRedirect) {
    return { authorized: true, redirect: exactRedirect.redirect };
  }

  return { authorized: true };
}
