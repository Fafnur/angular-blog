export interface NavigationLink {
  route: string;
  label: string;
  params?: object;
  fragment?: string;
  hide?: boolean;
  routerLinkActiveOptions?: boolean;
  icon?: string;
}
