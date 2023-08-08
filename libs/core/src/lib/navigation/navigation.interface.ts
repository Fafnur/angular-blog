export interface NavigationLink {
  route: string;
  label: string;
  params?: Record<string, any>;
  fragment?: string;
  hide?: boolean;
  routerLinkActiveOptions?: boolean;
  icon?: string;
}
