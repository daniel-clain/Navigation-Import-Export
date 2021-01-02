import { getState, setState } from "../getNavigation.state";

const menuItemsSelector = '.js-menu-resources.menu__list-items > .menu__branch'

export const scrapeNavigationData = async () => {
  
  console.log('start scraping')

  const {page} = getState()

  const navigationMenuElems = await page.$(menuItemsSelector)
  setState({navigationMenuElems})
  

  console.log('finished scraping')
}