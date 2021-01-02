import * as puppeteer from 'puppeteer'
import { getState, setState } from '../getNavigation.state'

let shopifyPartnersUrl = 'https://partners.shopify.com/118389/apps'
let partnersLoginEmail = 'info@processcreative.com.au'
let partnersLoginPassword = 'TtQCnL&4=&n8z%3DT^CD'
 
partnersLoginEmail = 'daniel@processcreative.com.au'
partnersLoginPassword = 'Isadora3302' /**/


export const gainAccessToNavigation = async () => {
  const browser: puppeteer.Browser = await puppeteer
  .launch({headless: false, slowMo: 30});
  let page = await browser.newPage();
  setState({page})
  
  browser.on('targetcreated', async (createdTarget: puppeteer.Target) => {
    const xpage = await createdTarget.page()
    if(xpage) setState({page: xpage})
  })

  await loginToShopifyPartners()
  await findStoreAndLogin()
  const shopifyAdminTarget = await browser.waitForTarget(target => {
    const targetIsShopifyAdmin = target.url().includes('myshopify.com/admin')
    return targetIsShopifyAdmin
  })
  page = await shopifyAdminTarget.page()
  setState({page})
  await accessNavigationView()

  return

  /* Implementation */

  async function loginToShopifyPartners(){
    console.log('* Login To Shopify Partners')
    await page.goto(shopifyPartnersUrl)

    console.log('--- enter email')
    const emailInputField = await page.$('#account_email')
    await emailInputField.focus()
    await emailInputField.type(partnersLoginEmail)
    await page.waitForTimeout(100)
    await (await page.$('button[type=submit]')).click()

    console.log('--- enter password')
    const passwordInputField = await page.waitForSelector('#account_password')
    await passwordInputField.focus()
    await passwordInputField.type(partnersLoginPassword)
    await page.waitForTimeout(100)
    await (await page.$('button[type=submit]')).click()
  }


  async function findStoreAndLogin(){   
    await page.waitForNavigation({
      waitUntil: 'domcontentloaded',
    });
    console.log('--- find store')
    const storeInputField = await page.$('#primary-nav-search-input')
    await storeInputField.focus()
    await storeInputField.type(getState().storeName)
    const storeItem = await page.waitForSelector('.quick-search__item--is-active')
    
    console.log('--- select store')
    await storeItem.click()
    await page.waitForSelector('#AppFrameMain',{
      visible: true
    })
    console.log('--- login to store')
    await page.waitForSelector('#AppFrameMain')
    await page.$eval('#AppFrameMain a', (e: HTMLElement) => e.click());

  }

  async function accessNavigationView(){

    console.log('--- go to navigation view')
    const fullUrl = page.url()
    const endOfBaseUrl = 'myshopify.com/admin'
    const endOfBaseUrlIndex = fullUrl.indexOf(endOfBaseUrl) + endOfBaseUrl.length
    const baseUrl = fullUrl.slice(0, endOfBaseUrlIndex)

    await page.goto(`${baseUrl}/menus/${getState().menuId}`)
    
  }

}