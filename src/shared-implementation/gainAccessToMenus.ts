import * as puppeteer from 'puppeteer'
import { Browser, LaunchOptions, Target } from 'puppeteer';
import { variables } from '../../config/variables';
import state from '../state'

let shopifyPartnersUrl = 'https://partners.shopify.com/118389/apps'


export const gainAccessToNavigation = async storeName => {
  const {automated, manualVariables, automatedVariables} = variables.login
  const launchOptions: LaunchOptions = {}
  if(variables.showInBrowser){
    launchOptions.headless = false
    launchOptions.slowMo = 30
    launchOptions.defaultViewport = null
  }
  if(automated == false){
    launchOptions.executablePath = manualVariables.browserPath
    launchOptions.userDataDir = manualVariables.browserDataPath
  }

  const browser: Browser = await puppeteer.launch(launchOptions);
  state.page = await browser.newPage(); 
  
  browser.on('targetcreated', async (createdTarget: Target) => {
    const page = await createdTarget.page()
    if(page){
      state.page = page
      console.log('doink', createdTarget);
      const cdp = await createdTarget.createCDPSession()
      const allCookies = await cdp.send('Network.getAllCookies')
      console.log('allCookies :>> ', allCookies);

      const current_url_cookies = await page.cookies();
      console.log('current_url_cookies :>> ', current_url_cookies);
    }
  })

  if(automated){
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
    await state.page.goto(variables.fromStore.storeUrl)
  }
  

  return

  /* Implementation */

  async function loginToShopifyPartners(){
    console.log('* Login To Shopify Partners')
    const {partnersLoginEmail, partnersLoginPassword} = automatedVariables
    await state.page.goto(shopifyPartnersUrl)

    console.log('--- enter email')
    const emailInputField = await state.page.$('#account_email')
    await emailInputField.focus()
    await emailInputField.type(partnersLoginEmail)
    await state.page.waitForTimeout(100)
    await (await state.page.$('button[type=submit]')).click()

    console.log('--- enter password')
    const passwordInputField = await state.page.waitForSelector('#account_password')
    await passwordInputField.focus()
    await passwordInputField.type(partnersLoginPassword)
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