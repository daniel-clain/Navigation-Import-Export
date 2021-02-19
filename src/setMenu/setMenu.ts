import { inputVariables } from '../config/inputVariables.data'
import { gainAccessToNavigation } from '../shared-implementation/gainAccessToMenus'
import { createMenu } from './setMenu-implementation/createMenus'
import getMenuData from './setMenu-implementation/getMenuData'
import { saveMenu } from './setMenu-implementation/saveMenu'

const {storeName} = inputVariables.toStore

const setMenu = async () => {
  try{
    await getMenuData()
    await gainAccessToNavigation(storeName)
    await createMenu()
    await saveMenu()
  }
  catch(e){
    console.log('caught error')
    console.log(e)
  }
}

const nodeRunSetMenu = process.argv[2] == 'run'
if(nodeRunSetMenu){
  setMenu()
}

export default setMenu
