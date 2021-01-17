
export type MenuData = {
  menus: Menu[]
}

export type Menu = {
  name: string
  nav: NavItem[]
}

export type NavItem = {
  navItemName: string
  link: Link
  subNav?: NavItem[]
}

export type Link = {
  title: string
  menu_item_type: string
}

