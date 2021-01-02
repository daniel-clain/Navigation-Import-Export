import * as readline from 'readline'
import {hex} from 'chalk'
import { setState } from '../getNavigation.state'
const {stdin, stdout} = process

export const takeInputFromUser = async () => {  
  //const storeName = await getStoreName()
  setState({storeName: 'Kirstin Ash (Australia)', menuId: 120447041615})
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
