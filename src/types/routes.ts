import type { LazyExoticComponent, ComponentType } from "react";

export interface RouteType {
  path: string;
  label?: string;
  icon?: LazyExoticComponent<ComponentType<any>>;
  component: LazyExoticComponent<ComponentType<any>>;
  layout?: "auth" | "default" | "none";
  permission?: string;
  group?: string;
  children?: RouteType[];
  redirectTo?: string;
  exact?: boolean;
}

export type LayoutProps = {
  children: React.ReactNode;
  route?: string;
};
