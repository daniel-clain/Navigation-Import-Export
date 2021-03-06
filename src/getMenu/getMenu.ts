import { variables } from '../../config/variables'
import { gainAccessToNavigation } from '../shared-implementation/gainAccessToMenus'
import cacheMenuInfo from './getMenu-implementation/cacheMenuInfo'
import { scrapeMenuInfo } from './getMenu-implementation/scrapeMenuInfo'

const {storeName} = variables.fromStore

const getMenu = async () => {
  await gainAccessToNavigation(storeName)
  await scrapeMenuInfo()
  await cacheMenuInfo()
}


const nodeRunGetMenu = process.argv[2] == 'run'
if(nodeRunGetMenu){
  getMenu()
}

export default getMenu

