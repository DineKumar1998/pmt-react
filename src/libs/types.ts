import type { JSX } from "react";

export interface RouteType {
  path: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
  layout?: string;
  permission?: string;
  group?: string;
}
