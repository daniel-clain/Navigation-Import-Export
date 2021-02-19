import * as puppeteer from 'puppeteer'
import { Browser, LaunchOptions, Target } from 'puppeteer';
import { inputVariables } from '../inputVariables.data';
import state from '../state'

let shopifyPartnersUrl = 'https://partners.shopify.com/118389/apps'


export const gainAccessToNavigation = async storeName => {
  const launchOptions: LaunchOptions = {}
  if(inputVariables.showInBrowser){
    launchOptions.headless = false
    launchOptions.slowMo = 30
  }
  if(!inputVariables.automateLogin){
    launchOptions.executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    launchOptions.userDataDir = 'C:\\Users\\InsertUserNameHere\\AppData\\Local\\Google\\Chrome\\User Data'
  }

  const browser: Browser = await puppeteer.launch(launchOptions);
  state.page = await browser.newPage();
  
  browser.on('targetcreated', async (createdTarget: Target) => {
    const page = await createdTarget.page()
    if(page) state.page = page
  })

  if(inputVariables.automateLogin){
    await loginToShopifyPartners()
    await findStoreAndLogin()
    const shopifyAdminTarget = await browser.waitForTarget(target => {
      const targetIsShopifyAdmin = target.url().includes('myshopify.com/admin')
      return targetIsShopifyAdmin
    })

    state.page = await shopifyAdminTarget.page()
  }
  else{
    console.log('doing direct access');
  }
  

  return

  /* Implementation */

  async function loginToShopifyPartners(){
    console.log('* Login To Shopify Partners')
    await state.page.goto(shopifyPartnersUrl)

    console.log('--- enter email')
    const emailInputField = await state.page.$('#account_email')
    await emailInputField.focus()
    await emailInputField.type(inputVariables.partnersLoginEmail)
    await state.page.waitForTimeout(100)
    await (await state.page.$('button[type=submit]')).click()

    console.log('--- enter password')
    const passwordInputField = await state.page.waitForSelector('#account_password')
    await passwordInputField.focus()
    await passwordInputField.type(inputVariables.partnersLoginPassword)
    await state.page.waitForTimeout(100)
    await (await state.page.$('button[type=submit]')).click()
  }


  async function findStoreAndLogin(){   
    await state.page.waitForNavigation({
      waitUntil: 'domcontentloaded',
    });
    console.log('--- find store')
    const storeInputField = await state.page.$('#primary-nav-search-input')
    await storeInputField.focus()
    await storeInputField.type(storeName)
    const storeItem = await state.page.waitForSelector('.quick-search__item--is-active')
    
    console.log('--- select store')
    await storeItem.click()
    await state.page.waitForSelector('#AppFrameMain',{
      visible: true
    })
    console.log('--- login to store')
    await state.page.waitForSelector('#AppFrameMain')
    await state.page.$eval('#AppFrameMain a.ui-button--primary', (e: HTMLElement) => e.click());

  }


}