import { Page } from "puppeteer"
import { MenuData } from "./types/navigation.types"

class GetMenuState{
  page: Page
  menuData: MenuData
}

let state: GetMenuState

export default state ||
((state = new GetMenuState()), state)