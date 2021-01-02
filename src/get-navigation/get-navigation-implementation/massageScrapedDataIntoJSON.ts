

type NavData = {
  menus: Menu[]
}

type Menu = {
  name: string
  items: MenuItem[]
}

type MenuItem = {
  name: sting
  link: string
  items: MenuItem[]
}


export const massageScrapedDataIntoJSON = () => {
  const {navigationMenuElems} = getState()
  console.log('navigationMenuElems', navigationMenuElems)
}