import {partnersLoginPassword} from './passwords/passwords'

export const variables = {
  menuName: 'Footer menu',
  fromStore: {
    storeName: 'Urth (Australia)', 
    storeUrl: 'https://gobe-au.myshopify.com/admin'
  },
  toStore: {
    storeName: 'Urth (International)',
    storeUrl: 'https://urth-international.myshopify.com/admin'
  },  
  login:{
    automated: false,
    automatedVariables:{
      partnersLoginEmail: 'daniel@processcreative.com.au',
      partnersLoginPassword,
    },
    manualVariables:{
      browserPath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      browserDataPath: 'C:\Users\\danie\\AppData\\Local\\Google\\Chrome\\User Data'

    }
  },
  showInBrowser: true,
}