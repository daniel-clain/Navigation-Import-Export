import { Page } from "puppeteer"
import { NavItem } from "../utility/navigation.types"

class GetNavigationState{
  storeName: string
  menuId: string
  page: Page
  navData: NavItem[]
}

let state: GetNavigationState

export default state ||
((state = new GetNavigationState()), state)