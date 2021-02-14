import { ElementHandle } from 'puppeteer'
import state from '../../state'
import { Link, NavItem } from '../../types/navigation.types'

export const createMenu = async (): Promise<boolean> => {
  
  await accessNavigationView()
  console.log('* start creating menus')
  console.log('menuData', state.menuData)

  await createBaseMenu()
  await recursivelyCreateMenuItems(state.menuData.nav)


  return await false
}


async function accessNavigationView(){

  console.log('--- go to navigation view')
  const fullUrl = state.page.url()
  const endOfBaseUrl = 'myshopify.com/admin'
  const endOfBaseUrlIndex = fullUrl.indexOf(endOfBaseUrl) + endOfBaseUrl.length
  const baseUrl = fullUrl.slice(0, endOfBaseUrlIndex)
  const goToUrl = `${baseUrl}/menus/new`
  console.log('goToURl', goToUrl)
  await state.page.goto(goToUrl)
  
}


const createBaseMenu = async () => {
  await state.page.waitForSelector('#menu-item-name')
  const titleInput = await state.page.$('#menu-item-name')
  await titleInput.type(state.menuData.name + ' test')
}


const recursivelyCreateMenuItems = async (nav: NavItem[], parentElement?: ElementHandle<Element>) => {
  const addButton = await state.page.$('.add-button')
  const {page} = state

  for await (let navItem of nav) {
    console.log(`--- creating nav item: ${navItem.navItemName}`)
    await openAddModal()
    await putInItemName(navItem.navItemName)
    await putInItemLink(navItem.link)
    await saveNavItem()

    if(parentElement){
      await moveItemUnderParentNavItem(navItem.navItemName, parentElement)
    }

    if(navItem.subNav){
      const navItemElement = await getNavItemElement(navItem.navItemName)
      await recursivelyCreateMenuItems(navItem.subNav, navItemElement)
    }
  }

  /* implementation */


  async function moveItemUnderParentNavItem(navItemName, parentElement: ElementHandle<Element>){
    console.log(`--- moving item under parent element`)
  }
  
  async function getNavItemElement(navItemName): Promise< ElementHandle<Element>>{
    const navItemClass = '.js-menu-resource'
    page.waitForSelector(navItemClass)
    const navItems = await page.$$(navItemClass)

    let navItemToReturn

    for await (let navItem of navItems){
      const itemName = await navItem.$('.menu-item-name')
      if(itemName == navItemName){
        navItemToReturn = navItem
        break;
      }
    }
    return navItemToReturn
  }

  async function openAddModal(){
    await addButton.click()

  }

  async function putInItemName(navItemName){
    const nameInput = await page.waitForSelector('#addMenuItemName')
    await nameInput.type(navItemName)
  }

  async function putInItemLink(link: Link){
    const linkType = link.menu_item_type
    const linkInput = await page.waitForSelector('#addMenuItemLink')
    if(linkType == 'http'){
      await linkInput.type('/')
      await state.page.$eval('#popover-dropdown-2 a', (addButton: HTMLButtonElement) => {addButton.click()})
    }
    else {

      await linkInput.type(link.title)
      await page.waitForTimeout(1000)
      const linkOptions = await page.$$('#popover-dropdown-2 a')
      
      for await (let option of linkOptions){
        const handle = await option.getProperty('innerText')
        const optionText = (await handle.jsonValue() as string).toLocaleLowerCase()

        if(
          optionText.includes('collections') && linkType == 'collection' ||
          optionText.includes('products') && linkType == 'catalog' ||
          optionText.includes('pages') && linkType == 'page' ||
          optionText.includes('blog posts') && linkType == 'blog'
        ){
          await option.evaluate((optionElem: 
            HTMLAnchorElement) => {
            optionElem.click()
          })

          
          await page.waitForTimeout(1000)
          const subLinkSelector = '.ui-url-browser__item .type--truncated'
          const linkOptions2 = await page.$$(subLinkSelector)

          if(linkType == 'catalog'){
            await linkOptions2[0].evaluate((optionElem: 
              HTMLAnchorElement) => {
                debugger
              optionElem.click()
            })

          }
          else{

            let found
            for await (let option of linkOptions2){
              const handle = await option.getProperty('innerText')
              const optionText = await handle.jsonValue() as string
              console.log(`option2 text ${optionText}`)
              if(optionText == link.title){
                found = true
                await option.evaluate((optionElem: 
                  HTMLAnchorElement) => {
                  optionElem.click()
                })
                break
              }
            }
            if(!found){
              console.log(`did not find matching link for ${link.title}`)
              const nameInput = await page.waitForSelector('#addMenuItemName')
              await nameInput.focus()

              await page.waitForTimeout(1000)
              await linkInput.type('/')
              await page.waitForTimeout(1000)
              await state.page.$eval('#popover-dropdown-2 a', (addButton: HTMLButtonElement) => {addButton.click()})
            }
          }

          break
        }

      }
    }


    
  }

  async function saveNavItem(){
    
    const addBtn = await page.waitForSelector('#add_a_menu_item_modal .ui-modal__primary-actions button')
    await addBtn.click()
    await page.waitForTimeout(1000)
    
  }

}


