import { Page } from "puppeteer"
import { NavItem } from "./types/navigation.types"

class GetMenuState{
  page: Page
  navData: NavItem[]
}

let state: GetMenuState

export default state ||
((state = new GetMenuState()), state)