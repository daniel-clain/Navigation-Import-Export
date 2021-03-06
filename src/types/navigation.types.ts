export type MenuData = {
  name: string
  nav: NavItem[]
}

export type NavItem = {
  navItemName: string
  link: Link
  subNav?: NavItem[]
}

export type Link = {
  linkText: string
  linkCategory: string
}
