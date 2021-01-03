import * as readline from 'readline'
import {hex} from 'chalk'
const {stdin, stdout} = process
import state from '../getNavigation.state'

export const takeInputFromUser = async () => {  
  //const storeName = await getStoreName()
  state.storeName = 'Kirstin Ash (Australia)'
  state.menuId = '120447041615'
}


const readLineInterface: readline.Interface = 
readline.createInterface({input: stdin, output: stdout})


const getStoreName = async () => {
  const storeName = await askForClientsStore()
  return storeName || getStoreName()
}

const askForClientsStore = async () => 
new Promise<string>(finished => 
  readLineInterface.question(
    hex('#fffb89')
    `What's the name of the client's store? `, 
    finished
  )
)
