import { ElementHandle } from 'puppeteer'
import state from '../../state'
import { Link, NavItem } from '../../types/navigation.types'

export const createMenu = async (): Promise<void> => {
  
  await accessNavigationView()

  console.log('* start creating menus')

  await createBaseMenu()
  await recursivelyCreateMenuItems(state.menuData.nav)

  console.log('* finished creating menus')

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

  for (let navItem of nav) {
    console.log(`--- creating nav item: ${navItem.navItemName}`)
    const addButton = await state.page.$('.add-button')
    await addButton.click()
    await putInItemName(navItem.navItemName)
    await putInItemLink(navItem.link)
    await saveNavItem()
    
    const navItemElement = await getNavItemElement(navItem.navItemName)

    /* if(parentElement){
      await moveItemUnderParentNavItem(navItemElement, parentElement)
    } */

    if(navItem.subNav){
      await recursivelyCreateMenuItems(navItem.subNav, navItemElement)
    }
    console.log(`--- finished item ${navItem.navItemName}`)

  }

}



  /* implementation */


  /* async function moveItemUnderParentNavItem(navItemElement: ElementHandle<Element>, parentElement: ElementHandle<Element>){
    console.log(`--- moving item under parent element`)
    const itemDragSelector = '.ui-sortable__handle'
    const navItemDragElem = await navItemElement.$(itemDragSelector)
    const dragElemBox = await navItemDragElem.boundingBox();
    const dragBoxCenter = {
      x: dragElemBox.x + dragElemBox.width / 2, 
      y: dragElemBox.y + dragElemBox.height / 2
    }

    const parentBox = await parentElement.boundingBox()
    const parentElemBottom = parentBox.y + parentBox.height

    //const yDistance = dragBoxCenter.y - parentElemBottom
    const aBitToTheRight = 20

    const {page} = state

    await page.mouse.move(dragBoxCenter.x, dragBoxCenter.y);
    await page.mouse.down();
    await page.mouse.move(aBitToTheRight, parentElemBottom);
    await page.mouse.up();


  } */
  
  async function getNavItemElement(navItemName): Promise< ElementHandle<Element>>{
    const navItemClass = '.js-menu-resource'
    await state.page.waitForSelector(navItemClass)
    const navItems = await state.page.$$(navItemClass)

    let navItemToReturn

    for (let navItem of navItems){
      const itemName = await navItem.$('.menu-item-name')
      
      const handle = await itemName.getProperty('innerText')
      const navElemText = (await handle.jsonValue() as string)
      if(navElemText == navItemName){
        navItemToReturn = navItem
        break;
      }
    }
    return navItemToReturn
  }


  async function putInItemName(navItemName){
    const nameInput = await state.page.waitForSelector('#addMenuItemName')
    await nameInput.type(navItemName)
  }

  async function putInItemLink(link: Link){
    const linkType = link.linkCategory
    const linkInput = await state.page.waitForSelector('#addMenuItemLink')
    if(linkType == 'http'){
      await linkInput.type('/')
      await state.page.$eval('#popover-dropdown-2 a', (addButton: HTMLButtonElement) => {addButton.click()})
    }
    else {

      await linkInput.type(link.linkText)
      await state.page.waitForTimeout(1000)
      const linkOptions = await state.page.$$('#popover-dropdown-2 a')
      
      for await (let option of linkOptions){
        const handle = await option.getProperty('innerText')
        const optionText = (await handle.jsonValue() as string).toLocaleLowerCase()

        if(
          optionText.includes('collections') && linkType == 'collection' ||
          optionText.includes('products') && (linkType == 'catalog' || linkType == 'product') ||
          optionText.includes('pages') && linkType == 'page' ||
          optionText.includes('blog posts') && linkType == 'blog'
        ){
          await option.evaluate((optionElem: 
            HTMLAnchorElement) => {
            optionElem.click()
          })

          
          await state.page.waitForTimeout(1000)
          const subLinkSelector = '.ui-url-browser__item .type--truncated'
          const linkOptions2 = await state.page.$$(subLinkSelector)

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
              if(optionText == link.linkText){
                found = true
                await option.evaluate((optionElem: 
                  HTMLAnchorElement) => {
                  optionElem.click()
                })
                break
              }
            }
            if(!found){
              console.log(`did not find matching link for ${link.linkText}`)
              const nameInput = await state.page.waitForSelector('#addMenuItemName')
              await nameInput.focus()

              await state.page.waitForTimeout(1000)
              await linkInput.type('/')
              await state.page.waitForTimeout(1000)
              await state.page.$eval('#popover-dropdown-2 a', (addButton: HTMLButtonElement) => {addButton.click()})
            }
          }

          break
        }

      }
    }

  }

  async function saveNavItem(){
    
    const addBtn = await state.page.waitForSelector('#add_a_menu_item_modal .ui-modal__primary-actions button')
    await addBtn.click()
    await state.page.waitForTimeout(1000)
    
  }


