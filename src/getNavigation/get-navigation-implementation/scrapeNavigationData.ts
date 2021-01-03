import { ElementHandle } from "puppeteer";
import { Link, NavItem } from "../../utility/navigation.types";
import state from "../getNavigation.state";


export const scrapeNavigationData = async () => {
  
  console.log('* start scraping')

  const navData: NavItem[] = await scrapeData()

  console.log('finished scraping')
}





const scrapeData = async (): Promise<NavItem[]> => {

  const navItemClass = 'js-menu-resource'
  const navListClass = 'menu__list-items'
  const hasChildrenClass = 'menu__branch'  
  const {page} = state

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
    await page.waitForSelector(selector)
    const items = await page.$$(selector)
    return items    
  }


  async function getNameAndLink(item: ElementHandle<Element>): Promise<{navItemName, link: Link}> {
    const editBtn = await item.$('.edit-button')
    await editBtn.click()
    const navItemName = await page.$eval('#editMenuItemName', 
    (elem: HTMLInputElement) => elem.value)

    const linkStringJson = await page.$eval('#editMenuItemLinkValue', 
    (elem: HTMLInputElement) => elem.value)
    const {title, menu_item_type} = JSON.parse(linkStringJson)
    const link: Link = {title, menu_item_type}

    await page.$eval('#edit_a_menu_item_modal .ui-modal__secondary-actions .ui-button', (cancelButton: HTMLButtonElement) => {debugger; cancelButton.click()})
    console.log(`--- scraped data for ${title}`)

    return {navItemName, link}
  }
}




    /* const test2 = await item.evaluateHandle(x => {
      console.log(x)
      debugger
      return x
    })

    const childItems = await page.evaluate(item => {
      console.log(item)
      debugger
      const itemChildren: HTMLElement[] = Array.from(item.children)
      const itemList = itemChildren.reduce((itemsList, child): HTMLElement => {
        const hasSubNavClass = child.classList.contains('menu__list-items')
        return itemsList || hasSubNavClass ? child : null
      }, null)

      const listChildren = <HTMLElement[]>Array.from(itemList.children)
      const listsItems = listChildren.filter(child => {
        console.log('k so')
        return child.classList.contains('js-menu-resource')
      })
      return listsItems
    }, item)
    console.log(childItems) */
    
    /* return  item.evaluateHandle((itemElem: HTMLElement) => {
      const itemsList = Array.from(item.children)
      .find((child: HTMLElement) => child.classList.contains(navItemClass))

      const listsItems = <HTMLElement[]>Array.from(itemsList.children).filter(child => child.classList.contains(navItemClass))

    }) */