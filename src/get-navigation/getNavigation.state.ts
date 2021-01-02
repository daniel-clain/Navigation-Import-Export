import { Page } from "puppeteer"

let state = {
  storeName: <string>null,
  menuId: <number>null,
  page: <Page>null,
  navigationMenuElems: null
}
export const getState = () => state
export const setState = update => state = {...state, ...update}