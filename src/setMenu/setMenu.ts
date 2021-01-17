import { inputVariables } from '../inputVariables.data'
import { gainAccessToNavigation } from '../shared-implementation/gainAccessToMenus'
import { createMenu } from './setMenu-implementation/createMenus'
import getMenuData from './setMenu-implementation/getMenuData'

const {storeName} = inputVariables.toStore

const setMenu = async () => {
  await getMenuData()
  await gainAccessToNavigation(storeName)
  await createMenu()
}

const nodeRunSetMenu = process.argv[2] == 'run'
if(nodeRunSetMenu){
  setMenu()
}

export default setMenu
