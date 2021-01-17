import { ElementHandle } from "puppeteer";
import { Link, NavItem } from "../../types/navigation.types";
import state from "../../state";
import { inputVariables } from "../../inputVariables.data";


export const scrapeMenuInfo = async (): Promise<void> => {
  
  await accessNavigationView()
  console.log('* start scraping')

  state.navData = await scrapeData()
}


async function accessNavigationView(){

  console.log('--- go to navigation view')
  const fullUrl = state.page.url()
  const endOfBaseUrl = 'myshopify.com/admin'
  const endOfBaseUrlIndex = fullUrl.indexOf(endOfBaseUrl) + endOfBaseUrl.length
  const baseUrl = fullUrl.slice(0, endOfBaseUrlIndex)
  const {menuId} = inputVariables.fromStore
  const goToUrl = `${baseUrl}/menus/${menuId}`
  console.log('goToURl', goToUrl)
  await state.page.goto(goToUrl)
  
}



const scrapeData = async (): Promise<NavItem[]> => {

  const navItemClass = 'js-menu-resource'
  const navListClass = 'menu__list-items'
  const hasChildrenClass = 'menu__branch'

  return recursivelyGetNavData(await getTopLevelItems())

  /* Utility Functions */


  async function recursivelyGetNavData(
    items: ElementHandle<Element>[]): Promise<NavItem[]>{

    let navItems: NavItem[] = []
    
    for await (let item of items){
      let navItem: NavItem
      const nameAndLink = await getNameAndLink(item) 
      console.log(`--- scraping for ${nameAndLink.navItemName}`)
      if(await itemHasChildren(item)){
        console.log(`--- ${nameAndLink.navItemName} has sub nav =>`)
        await expandSubNav(item)
        navItem = {
          ...nameAndLink, 
          subNav: await recursivelyGetNavData(await getChildrenItems(item))
        }
      }
      else {
        navItem = nameAndLink
      }
      navItems.push(navItem)
    }

    return navItems

  }


  async function itemHasChildren(item: ElementHandle<Element>): Promise<boolean>{
    const classList = Object.values(await (await item.getProperty('classList')).jsonValue())
    return classList.includes(hasChildrenClass)
  }

  async function expandSubNav(item: ElementHandle<Element>){
    const expandBtn = await item.$(':scope > .ui-stack > .ui-stack-item > button')
    await expandBtn.click()
  }


  async function getChildrenItems(item: ElementHandle<Element>): Promise<ElementHandle<Element>[]>{
    return item.$$(':scope > .menu__list-items > .js-menu-resource')
  }


  async function getTopLevelItems(): Promise<ElementHandle<Element>[]>{
    const selector = `.ui-type-container > .${navListClass} > .${navItemClass}`
    await state.page.waitForSelector(selector)
    const items = await state.page.$$(selector)
    return items    
  }


  async function getNameAndLink(item: ElementHandle<Element>): Promise<{navItemName, link: Link}> {
    const editBtn = await item.$('.edit-button')
    await editBtn.click()
    const navItemName = await state.page.$eval('#editMenuItemName', 
    (elem: HTMLInputElement) => elem.value)

    const linkStringJson = await state.page.$eval('#editMenuItemLinkValue', 
    (elem: HTMLInputElement) => elem.value)
    const {title, menu_item_type} = JSON.parse(linkStringJson)
    const link: Link = {title, menu_item_type}

    await state.page.$eval('#edit_a_menu_item_modal .ui-modal__secondary-actions .ui-button', (cancelButton: HTMLButtonElement) => {debugger; cancelButton.click()})
    console.log(`--- scraped data for ${title}`)

    return {navItemName, link}
  }
}
