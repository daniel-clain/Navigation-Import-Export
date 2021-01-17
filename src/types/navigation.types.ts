

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
  title: string
  menu_item_type: string
}

/* 

if its a submenu
after creating the item
  find all items
    for each item, look for its name child
      if the name child matches, set the parent item as parent
for each new item created, drag that item under the parent item



*/